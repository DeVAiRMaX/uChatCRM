import { Component } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../assets/module/user.class';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection } from '@angular/fire/firestore';
@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  isLoading = false;

  constructor(private dialog: MatDialogRef<AddUserComponent>, private firestore: Firestore) {}
  user = new User();
  birthday: Date = new Date();

  ngOnInit() {
    console.log(this.user);
  }

  cancel() {
    this.dialog.close();
  }

  saveUser() {
    this.isLoading = true;
    this.user.birthday = this.birthday.getTime().toString();
    addDoc(collection(this.firestore, 'users'), this.user.toJson())
    .then((result) => {
      this.isLoading = false;
      console.log(result);
      this.dialog.close();
    })
    .catch((err) => {
        console.error('Error adding user:', err);
        this.isLoading = false;
    });
  }
}
