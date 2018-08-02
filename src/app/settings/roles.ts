import {Component, Input} from '@angular/core';
import {Http} from "@angular/http";
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {clone} from '../shared/helpers';

@Component({
    selector: 'roles',
    templateUrl: './roles.html',
})
export class Roles {

    public errors = {};

    public role:any = {};

    public selected:any = {};

    public roles = [];

    public permissions = [];

    public role_id = '';

    public modules = [];

    public modulePermissions = {};

    public creating:boolean = false;

    public savingPermissions = false;

    constructor(
        protected http: Http,
        protected router: Router,
        protected auth:AuthService
    ){}
    ngOnInit() {
        this.fetchModules();
        this.http.get('/core/api/v1/roles/list').subscribe((res)=>{
            this.roles = res.json().data;
            this.selected = this.roles[0];
            this.fetchPermissions(this.selected);
        });
    }
    edit(role){
        this.role = clone(role);
    }
    cancelEdit(){
        this.role = {};
        this.errors = {};
    }
    create(){
        this.creating = true;
        this.http.post('/core/api/v1/roles', this.role).subscribe((res)=>{
            this.errors = {};
            this.role = {};
            var role = res.json().data;
            this.roles.unshift(role);
            this.creating = false;
        }, (res)=>{
            this.errors = res.json().errors;
            this.creating = false;
        });
    }
    update(){
        this.creating = true;
        this.http.put(`/core/api/v1/roles/${this.role.id}`, this.role).subscribe((res)=>{
            this.creating = false;
            this.errors = {};
            this.role = {};
            var role = res.json().data;
            var index = this.roles.findIndex((r)=>{
                return r.id === role.id
            });
            this.roles[index] = role;
        }, (res)=>{
            this.errors = res.json().errors;
            this.creating = false;
        });
    }
    destroy(role){
        if(false == confirm(`Are you sure you want to remove role ${role.display_name}`)) return;
        this.http.delete(`/core/api/v1/roles/${role.id}`).subscribe((res)=>{
            var index = this.roles.indexOf(role);
            this.roles.splice(index, 1);
        });
    }
    fetchModules(){
        this.http.get(`/core/api/v1/installed_modules`).subscribe((res)=>{
            var data =  res.json().data;
            this.modules = data.modules;
            this.modulePermissions = data.permissions;
        });
    }
    fetchPermissions(role){
        this.role_id = role.id;
        this.http.get(`/core/api/v1/roles/${role.id}/permissions`).subscribe((res)=>{
            this.permissions = res.json().data;
        });
    }
    hasPermissions(permission_id){
        return this.permissions.some((p)=>{
            return p.id == permission_id;
        })
    }
    togglePermission(permission)
    {
        var index = this.permissions.findIndex((p)=>{
            return p.id == permission.id;
        });
        if(index == -1){
            this.permissions.push(permission);
        }
        else {
            this.permissions.splice(index, 1);
        }
    }
    togglePermissions(module_id)
    {
        this.modulePermissions[module_id].map((permission)=>{

        });
    }
    isAdmin(role_id){
        for(var role of this.roles){
            if(role.id == role_id && role.name == 'admin'){
                return true;
            }
        }
        return false;
    }
    savePermissions(){
        this.savingPermissions = true;
        var ids = this.permissions.map((p)=>{
            return p.id
        });
        this.http.put(`/core/api/v1/roles/${this.selected.id}/permissions`, {'ids': ids}).subscribe(()=>{
            if(this.auth.getUser().user.role_id == this.role_id){
                this.auth.data.permissions = clone(this.permissions);
            }
            this.savingPermissions = false;
        });
    }

}