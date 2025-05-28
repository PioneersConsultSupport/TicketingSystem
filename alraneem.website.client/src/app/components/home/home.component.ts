import { Component } from '@angular/core';
import emailjs from 'emailjs-com';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  formSubmitted: boolean = false; // Start as false
  name!: string;
  email!: string;
  subject!: string;
  message!: string;
  constructor(private messageService: MessageService) {}
  sendEmail() {
    if (!this.name || !this.email || !this.subject || !this.message) {
      // this.toastr.error('Please fill in all form fields!', 'error', {
      //   timeOut: 3000,
      //   positionClass: 'toast-bottom-right',
      //   closeButton: true,
      //   progressBar: true,
      // });
      this.messageService.add({
                  severity: 'error',
                  summary: 'error',
                  detail: 'Please fill in all form fields!',
                  life: 3000,
                });
      return;
    }
    const templateParams = {
      to_name: 'Pioneer Consulting Team',
      from_name: this.name,
      from_email: this.email,
      subject: this.subject,
      message: this.message,
    };
    this.formSubmitted = true;
    emailjs
      .send(
        'service_c2i3tjc',
        'template_96smusi',
        templateParams,
        'vmC2qnWpyXc5b4sEi'
      )
      .then((response) => {
        this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Email sent successfully!',
                  life: 3000,
                });
        this.resetForm();
        this.formSubmitted = false;
      })
      .catch((error) => {
        // this.toastr
        //   .error('Error sending email!', 'Error', {
        //     timeOut: 3000,
        //     positionClass: 'toast-bottom-right',
        //     closeButton: true,
        //     progressBar: true,
        //   })
        //   .onHidden.toPromise()
        //   .then(() => {
        //     this.formSubmitted = false;
        //   });
          this.messageService.add({
                  severity: 'error',
                  summary: 'error',
                  detail: 'Error sending email!',
                  life: 3000,
                });
                this.formSubmitted = false;
      });
  }
  resetForm() {
    this.name = '';
    this.email = '';
    this.subject = '';
    this.message = '';
  }
}
