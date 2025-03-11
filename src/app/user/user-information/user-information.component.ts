import { Component } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../assets/module/user.class';
import { collection, Firestore, doc, getDoc, query, onSnapshot, deleteDoc } from '@angular/fire/firestore';
import { subscribeOn } from 'rxjs';
import { EditUserComponent } from './edit-user/edit-user.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-user-information',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-information.component.html',
  styleUrl: './user-information.component.scss'
})
export class UserInformationComponent {
  constructor(private route: ActivatedRoute, private firestore: Firestore, private dialog: MatDialog) { }
  user: any = new User();
  userID: any;
  birthday: Date = new Date();

  ngOnInit() {
    this.userID = this.route.snapshot.params['id'];
    const userRef = onSnapshot(doc(this.firestore, 'users', this.userID), (doc) => {
      this.user = doc.data();
    });
  }

  openEditUserDialog() {
    let dialogRef = this.dialog.open(EditUserComponent)
    dialogRef.componentInstance.user = new User(this.user);
    dialogRef.componentInstance.userID = this.userID;
  }

  DeleteUser() {
    const userRef = doc(this.firestore, 'users', this.userID);
    deleteDoc(userRef);
    location.href = '/user';
  }
}