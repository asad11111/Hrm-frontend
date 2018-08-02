
export class ActivitiesHelper {


    icons = {
        'Department': 'fa fa-building-o',
        'Designation': 'fa fa-suitcase',
        'Employee': 'fa fa-user-o',
        'Clock': 'fa fa-clock-o'
    };

    badges = {
        '0': 'bg-default',
        '1': 'bg-primary',
        '2': 'bg-success',
        '3': 'bg-danger'
    };

    getClass(activity){
        let icon = this.icons[activity.resource] || '';
        let badge = this.badges[activity.type] || '';
        return [icon, badge];
    }


}