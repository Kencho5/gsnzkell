import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {

  profileForm = new FormGroup({
    name:  new FormControl(this.data.name, Validators.required),
    email:  new FormControl(this.data.email, Validators.required),
    phone:  new FormControl(this.data.phone_number, Validators.required),
    city:  new FormControl(this.data.city, Validators.required),
    facebook:  new FormControl(this.data.facebook, Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
  }
  
  closeModal(event) {
    if(event.target.textContent == "Cancel") {
      this.dialogRef.close("cancel");
    } else {
      this.dialogRef.close({
        data: this.profileForm.value
      });
    }
  }
}
