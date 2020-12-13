import { Component, OnDestroy, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { UserSettings } from 'src/app/_models/userSettings';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  userSettings: UserSettings;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}]

  constructor(public memberService: MembersService, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
    this.user = user;
    //this.userParams = this.memberService.getUserParams()
   })
   this.memberService.getUserSettings(this.user.username).pipe(take(1)).subscribe(settings => {
    this.userSettings = settings;
    this.userParams = new UserParams(this.userSettings);
  })
  
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.setUserParams(this.userSettings);
    this.memberService.getMembers().subscribe(response =>{
      this.members = response.result;
      this.pagination = response.pagination;
    });
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memberService.setUserParams(this.userSettings);
    this.loadMembers();
  }
}
