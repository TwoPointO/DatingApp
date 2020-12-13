import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { UserSettings } from '../_models/userSettings';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User;
  userParams: UserParams;
  userSettings: UserSettings = {
    minAge: 20,
    maxAge: 50,
    gender: 'male',
    id: 1
  }

  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      //this.userParams = new UserParams(this.userSettings);
    })
    this.getUserSettings(this.user.username).subscribe(settings => {
      this.userSettings = settings;
      this.userParams = new UserParams(this.userSettings);
    })
  }

  getUserParams() {
    return new UserParams(this.userSettings);
  }

  setUserParams(userSettings: UserSettings) {
    this.userParams = new UserParams(this.userSettings);
  }

  resetUserParams() {
    this.userParams = new UserParams(this.userSettings);
    return this.userParams;
  }

  getMembers() {
    var response = this.memberCache.get(Object.values(this.userParams).join('-'));
    if(response) {
      return of(response);
    }

    let params = getPaginationHeaders(this.userParams.pageNumber, this.userParams.pageSize);

    params = params.append('minAge', this.userParams.minAge.toString());
    params = params.append('maxAge', this.userParams.maxAge.toString());
    params = params.append('gender', this.userParams.gender);
    params = params.append('orderBy', this.userParams.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http)
      .pipe(map(response => {
        this.memberCache.set(Object.values(this.userParams).join('-'), response);
        return response;
      }))
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.username === username);

    if(member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username)
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {})
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes', params, this.http);
  }

  getUserSettings(username: string) {
    return this.http.get<UserSettings>(this.baseUrl + 'users/settings/' + username);
  }

  saveSettings(userSettings: UserSettings) {
    return this.http.put(this.baseUrl + 'settings/update', userSettings);
  }
}
