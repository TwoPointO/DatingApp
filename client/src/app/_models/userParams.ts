import { User } from './user';
import { UserSettings } from './userSettings';

export class UserParams {
    gender: string;
    minAge = 18;
    maxAge = 99;
    pageNumber = 1;
    pageSize = 5;
    orderBy = 'lastActive';

    constructor(userSettings: UserSettings, pageNumber = 1) {
        this.gender = userSettings.gender,
        this.minAge = userSettings.minAge,
        this.maxAge = userSettings.maxAge,
        this.pageNumber = pageNumber
    }
}