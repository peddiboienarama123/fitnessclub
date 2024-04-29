import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { User } from '../../../Models/user.model';
import { UserService } from '../service/user.service';
import { Trainer } from '../../../Models/trainer.model';
import { Doctor } from '../../../Models/doctor.model';
import { DoctorService } from '../service/doctor.service';
import { TrainerService } from '../service/trainer.service';

// import { UserService } from '../../../Services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnDestroy {
  userInput: string = '';
  dateError: boolean = false;
  private subscription!: Subscription;
  userForm!: FormGroup;
  isEditMode = false;
  userId: any = 0;
  doctorId: FormControl = new FormControl('', [Validators.required]);
  trainerId: FormControl = new FormControl('', [Validators.required]);
  userDetails: any;
  selectedTrainer: string = "";
  selectedDoctor: string = "";
  trainer!: Trainer;
  doctor!: Doctor
  trainerDetails: any;
  doctorDetails: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    // private user:UserService,
    private route: ActivatedRoute,
    private router: Router,
    private trainerService: TrainerService,
    private doctorService: DoctorService

  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get("id");
    this.userForm = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
      password: this.formBuilder.control('', [Validators.required]),
      dateOfBirth: this.formBuilder.control(null, [Validators.required]),
      email: this.formBuilder.control('', [Validators.required]),
      contactNumber: this.formBuilder.control('', [Validators.required]),
      doctorCode: this.formBuilder.control('', Validators.required),
      trainerCode: this.formBuilder.control('', Validators.required),
    });
    if (this.userId != 0 && this.userId != null) {
      this.getDetails(this.userId);
    }




  } ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit(): void {
    const user: User = this.userForm.value;
    
    (user);

    if (this.isEditMode) {
      user.userId = this.userId;
    }


    this.userService.saveUser(user).subscribe(() => {
      this.router.navigate(['/admin/users/add/historymedical']);
    });
  }


  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = control.value;
    const currentDate = new Date();

    if (selectedDate > currentDate) {
      return { futureDate: true };
    }

    return null;
  }
  update() {
    const user: User = this.userForm.value;
    user.userId = this.userDetails.userId

    this.userService.updateuser(user).subscribe(() => {
      this.router.navigate(['/admin/users']);
    });
  }



  getDetails(userId: any): void {
    if (userId != null) {
      this.userService.getUserById(userId).subscribe(
        (data: any) => {
          this.userDetails = data;
          (JSON.stringify(this.userDetails))
          this.userForm.patchValue(this.userDetails);
        }, (error: any) => {
          (error)
        }

      )
    }
  }
  validateDate() {
    const selectedDate = new Date(this.userForm.get('dateOfBirth')?.value);

    if (selectedDate.getFullYear() > 2006) {
      this.dateError = true;
    } else {
      this.dateError = false;
    }
  }


}
