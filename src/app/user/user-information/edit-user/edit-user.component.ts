import { Component } from '@angular/core';
import { SharedModule } from '../../../shared.module';
import { User } from '../../../../assets/module/user.class';
import { MatDialogRef } from '@angular/material/dialog';
import { doc, Firestore, onSnapshot, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {
  isLoading = false;
  user: any = new User();
  userID: any;
  birthday: Date = new Date();

  constructor(private dialogRef: MatDialogRef<EditUserComponent>, private firestore: Firestore) {
  }

  saveUser() {
    this.isLoading = true;
    this.user.birthday = this.birthday.getTime().toString();
    const userRef = doc(this.firestore, 'users', this.userID);
    const userData = this.user.toJson();
    try {
      updateDoc(userRef, userData);
      this.isLoading = false;
      this.dialogRef.close();
    } catch (err) {
      console.error('Error adding user:', err);
      this.isLoading = false;
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
