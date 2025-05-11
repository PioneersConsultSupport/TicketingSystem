import { Component } from '@angular/core';
import { EmployeeService } from '../../Services/Employee.Service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent {

  teamMembers: any;
  constructor(private employeeService: EmployeeService) {
    window.scrollTo(0, 0);
  }
  ngOnInit(): void {
    //this.fetchEmployees();
    this.teamMembers = [
      {
        "id": "a311b613-11be-446a-4883-08dd45e6d6b4",
        "title": "Mr",
        "name": "Fadi Karajeh",
        "role": "Managing Director",
        "description": "I'm the company founder, built the team, supervised the organization strategic direction, and insure qualitative delivery.",
        "profileImage": "assets/img/team/fadi1.png",
        "twitterUrl": null,
        "facebookUrl": null,
        "instagramUrl": null,
        "linkedInUrl": null
      },
      {
        "id": "bb8f0fad-780e-4073-4884-08dd45e6d6b4",
        "title": "Mr",
        "name": "Haitham Hannoun",
        "role": "Administrative Manager",
        "description": "Responsible for overseeing the smooth operation of the office and ensuring that all administrative tasks are completed efficiently.",
        "profileImage": "assets/img/team/haitham.jpg",
        "twitterUrl": null,
        "facebookUrl": null,
        "instagramUrl": null,
        "linkedInUrl": null
      },
      {
        "id": "d0b77ab9-58cc-403e-488b-08dd45e6d6b4",
        "title": "Mr",
        "name": "Mohannad Salameh",
        "role": "Senior Functional Consultant",
        "description": "Working with Functional Consultants to understand and review the feasibility of business requirements. Gathering business requirements for enhancements, customizations and developing technical requirement documents.",
        "profileImage": "assets/img/team/muhannad.jpg",
        "twitterUrl": null,
        "facebookUrl": null,
        "instagramUrl": null,
        "linkedInUrl": null
      },
      {
        "id": "78e3e645-52ff-4a57-4886-08dd45e6d6b4",
        "title": "Mr",
        "name": "Moath Qutaish",
        "role": "Senior Technical Consultant",
        "description": "Business understating, Solution architect, and quality assurance.",
        "profileImage": "assets/img/team/moath1.JPG",
        "twitterUrl": null,
        "facebookUrl": null,
        "instagramUrl": null,
        "linkedInUrl": null
      },
      {
        "id": "6e7ec74b-0299-41e7-488d-08dd45e6d6b4",
        "title": "Mr",
        "name": "Marwan Hijazin",
        "role": "Functional Consultant",
        "description": "Collaborate with clients to understand their financial processes and configure ERP systems to meet their needs.",
        "profileImage": "assets/img/team/marwan.jpg",
        "twitterUrl": null,
        "facebookUrl": null,
        "instagramUrl": null,
        "linkedInUrl": null
      },
      {
        "id": "e6bbc227-649f-4a80-4887-08dd45e6d6b4",
        "title": "Ms",
        "name": "Rana Adwan",
        "role": "Accountant",
        "profileImage": "assets/img/team/rana.jpg",
        "description": "A skilled accountant specializing for managing financial records,handling accounts payable and receivable, and ensuring compliance with financial regulations.",
        "twitterUrl": null,
        "facebookUrl": null,
        "instagramUrl": null,
        "linkedInUrl": null
      },
      {
        "id": "1b60301b-19bb-48aa-4885-08dd45e6d6b4",
        "title": "Ms",
        "name": "Lujayn AL Dmour",
        "role": "Projects Coordinator",
        "description": "handles administrative tasks for the project manager and team members to keep the project running smoothly.",
        "profileImage": "assets/img/team/lojayn.jpg",
        "twitterUrl": null,
        "facebookUrl": null,
        "instagramUrl": null,
        "linkedInUrl": null
      },
      {
        "id": "51c8afa2-9159-4345-488c-08dd45e6d6b4",
        "title": "Mr",
        "name": "Mohammad Karajeh",
        "role": "Functional Consultant",
        "description": "Collaborate with clients to understand their financial processes and configure ERP systems to meet their needs.",
        "profileImage": "assets/img/team/mkarajeh.jpg",
        "twitterUrl": null,
        "facebookUrl": null,
        "instagramUrl": null,
        "linkedInUrl": null
      },
      {
        "id": "da8954e1-02de-4a28-4889-08dd45e6d6b4",
        "title": "Mr",
        "name": "Mohammad Mheidat",
        "role": "Senior Web Developer",
        "description": "Identifying user and system requirements for new websites and applications.Prioritizing software development projects, setting timelines and assigning tasks to team members.",
        "profileImage": "assets/img/team/mheidat.jpg",
        "twitterUrl": null,
        "facebookUrl": null,
        "instagramUrl": null,
        "linkedInUrl": null
      },
      {
        "id": "3ebc01a0-0290-4780-488e-08dd45e6d6b4",
        "title": "Ms",
        "name": "Lama Dmaidat",
        "role": "Functional Consultant",
        "description": "Collaborate with clients to understand their financial processes and configure ERP systems to meet their needs.",
        "profileImage": "assets/img/team/lama.jpg",
        "twitterUrl": null,
        "facebookUrl": null,
        "instagramUrl": null,
        "linkedInUrl": null
      },
      {
        "id": "0b6cdcc5-eba2-40d0-4888-08dd45e6d6b4",
        "title": "Mr",
        "name": "Saleem Abu Elayyan",
        "role": "Technical Consultant",
        "description": "Expertise in software design, development, and testing to create innovative and effective solutions for our clients.",
        "profileImage": "assets/img/team/saleem.JPG",
        "twitterUrl": null,
        "facebookUrl": null,
        "instagramUrl": null,
        "linkedInUrl": null
      },
      {
        "id": "c8817ccd-8cf5-403a-488a-08dd45e6d6b4",
        "title": "Ms",
        "name": "Rogina Irshaidat",
        "role": "Technical Consultant",
        "description": "Expertise in software design, development, and testing to create innovative and effective solutions for our clients.",
        "profileImage": "assets/img/team/rogena.jpg",
        "twitterUrl": null,
        "facebookUrl": null,
        "instagramUrl": null,
        "linkedInUrl": null
      },
      {
        "id": "8005c50e-9590-4d49-488f-08dd45e6d6b4",
        "title": "Ms",
        "name": " Najwa Badawi- KSA",
        "role": "Functional Consultant",
        "description": "Collaborate with clients to understand their financial processes and configure ERP systems to meet their needs.",
        "profileImage": "assets/img/team/najwa.jpg",
        "twitterUrl": null,
        "facebookUrl": null,
        "instagramUrl": null,
        "linkedInUrl": null
      },
      {
        "id": "8005c50e-9590-4d49-488f-08dd45e6d6b4",
        "title": "Mr",
        "name": "Ibrahim El_Dali",
        "role": "Senior Mobile Developer",
        "description": "Design, develop, and maintain mobile applications for iOS and/or Android platforms.",
        "profileImage": "assets/img/team/Ibrahim.jfif",
        "twitterUrl": null,
        "facebookUrl": null,
        "instagramUrl": null,
        "linkedInUrl": null
      }
    ]
  }

  fetchEmployees(): void {
    this.employeeService.getAllEmployees().subscribe(
      (data) => {
        this.teamMembers = data;
        console.log('Employees:', this.teamMembers);
      },
      (error) => {
        console.error('Error fetching employees', error);
      }
    );
  }

}
