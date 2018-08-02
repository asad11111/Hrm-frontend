import {BaseStore} from '../../shared/flux';
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {clone} from '../../shared/helpers';

export enum actions {
    FETCH_EMPLOYEE_SHIFTS,
    FETCH_SHIFTS,
    NEW_SHIFT,
    CANCEL_NEW_SHIFT,
    SAVE_SHIFT,
    EDIT_SHIFT,
    UPDATE_SHIFT,
}
interface State {
    employee:any
    listView:{
        shifts: Array<any>
        fetched: boolean
    }
    shiftModal:{
        shifts: Array<any>
        shift:any
        errors: any
    };
}
var state:State = {
    employee: {},
    listView: {
        shifts: [],
        fetched: false
    },
    shiftModal: {
        shifts: [],
        shift: null,
        errors: {}
    }
};

@Injectable()
export class EmployeeShiftsStore extends BaseStore {

    constructor(protected http:Http){
        super();
        this.on(actions.FETCH_EMPLOYEE_SHIFTS, this.fetchEmployeeShifts);
        this.on(actions.FETCH_SHIFTS, this.fetchShifts);
        this.on(actions.NEW_SHIFT, this.newShift);
        this.on(actions.CANCEL_NEW_SHIFT, this.cancelNewShift);
        this.on(actions.SAVE_SHIFT, this.saveShift);
        this.on(actions.EDIT_SHIFT, this.editShift);
        this.on(actions.UPDATE_SHIFT, this.updateShift);
    }
    getState(){
        return state;
    }
    fetchEmployeeShifts = (employee_id)=>{
        this.http.get(`/attendance/api/v1/employees/${employee_id}/shifts`).subscribe((res)=>{
            state.listView.fetched = true;
            state.listView.shifts = res.json().data;
        });
    };
    fetchShifts = ()=>{
        this.http.get(`/attendance/api/v1/shifts`).subscribe((res)=>{
            state.shiftModal.shifts = res.json().data;
        });
    };
    newShift = ()=>{
        state.shiftModal.shift = {employee_id: state.employee.id};
    };
    cancelNewShift = ()=>{
        state.shiftModal.shift = null;
        state.shiftModal.errors = {};
    };
    saveShift = (employeeId)=>{
        this.http.post(`/attendance/api/v1/employees/${employeeId}/shifts`, state.shiftModal.shift)
        .subscribe((res)=>{
            var shift = res.json().data;
            state.listView.shifts.unshift(shift);
            state.shiftModal.shift= null;
        },(res)=>{
            if(res.status !== 422) return;
            state.shiftModal.errors = res.json().errors;
        });
    };
    editShift = (shift)=>{
        state.shiftModal.shift = clone(shift);
    };
    updateShift = (shift)=>{
        this.http.put(`/attendance/api/v1/employees/${state.employee.id}/shifts/${shift.id}`, shift).subscribe((res)=>{
            var shift = res.json().data;
            var index = state.listView.shifts.findIndex((s)=>{
                return s.id = shift.id
            });
            state.listView.shifts[index] = shift;
            state.shiftModal.shift= null;
        },(res)=>{
            if(res.status !== 422) return;
            state.shiftModal.errors = res.json().errors;
        });

    };
}

