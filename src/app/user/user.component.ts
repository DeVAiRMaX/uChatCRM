import { Component } from '@angular/core';
import { SharedModule } from '../shared.module';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from './add-user/add-user.component';
import { collection, collectionData, deleteDoc, doc, Firestore, onSnapshot, query } from '@angular/fire/firestore';
import { User } from '../../assets/module/user.class';
import { map } from 'rxjs';
import { UserInformationComponent } from './user-information/user-information.component';
import { EditUserComponent } from './user-information/edit-user/edit-user.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  allUsers: any[] = [];
  user = new User();

  constructor(public dialog: MatDialog, private firestore: Firestore) {
    this.subscribeToUserChanges();
  }



  subscribeToUserChanges() {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef);

    const unsub = onSnapshot(q, (snapshot) => {
      this.allUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    });

    return unsub;
  }

  openAddUserDialog(): void {
    this.dialog.open(AddUserComponent);
  }

  EditUser(userId: string) {
    const dialogRef = this.dialog.open(EditUserComponent);
    const user = this.allUsers.find(u => u.id === userId);
    if (user) {
      dialogRef.componentInstance.user = new User(user);
      dialogRef.componentInstance.userID = userId;
    }
  }

  DeleteUser(userId: string) {
    const userRef = doc(this.firestore, 'users', userId);
    deleteDoc(userRef);
  }
}