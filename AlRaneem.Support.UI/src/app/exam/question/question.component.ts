import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DemoMaterialModule } from '../../demo-material-module';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, DemoMaterialModule, MatCardModule, MatRadioModule, MatButtonModule, FormsModule, TranslatePipe],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  courseId: number | null = null;
  unitId: number | null = null;
  questionData: any = null;
  selectedChoice: number | null = null;  // Holds the selected choice ID
  submitted: boolean = false;  // Tracks if the answer has been submitted
  selectedChoiceText: string | null = null;  // Holds the selected choice text for display
  apiUrl = 'Question/generateAIQuestion';  // Question API URL
  answerApiUrl = 'UserAnswer/answerQuestion';  // Answer API URL

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    // Get courseId and unitId from query parameters
    this.route.queryParams.subscribe(params => {
      this.courseId = Number(params['courseId']);
      this.unitId = Number(params['unitId']);

      if (this.courseId && this.unitId) {
        // Fetch the question
        this.getQuestion(this.courseId, this.unitId);
      }
    });
  }

  // Method to fetch the question from the API
  getQuestion(courseId: number, unitId: number): void {
    const url = `${this.apiUrl}?courseId=${courseId}&unitId=${unitId}`;
    this.http.get<any>(url).subscribe(
      (response: any) => {
        if (response.IsSuccess) {
          this.questionData = response.Data;
          this.resetForm();  // Reset the form for the new question
        } else {
          console.error('Failed to generate question:', response.Errors);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  // Method to handle answer submission
  submitAnswer(): void {
    if (this.selectedChoice !== null) {
      // Find the selected choice text
      const selectedChoiceObj = this.questionData.choices.find((choice: any) => choice.id === this.selectedChoice);
      //this.selectedChoiceText = selectedChoiceObj ? selectedChoiceObj.text : null;

      // Call the API to submit the answer
      this.submitUserAnswer(this.unitId!, this.questionData.id, this.selectedChoice);
    } else {
      console.error('No choice selected');
    }
  }

  // API call to submit the user's answer
  submitUserAnswer(unitId: number, questionId: number, choiceId: number): void {
    const url = this.answerApiUrl;

    // Create the request body
    const requestBody = {
      unitId: unitId,
      questionId: questionId,
      choiceId: choiceId
    };

    // Use POST instead of GET
    this.http.post<any>(url, requestBody).subscribe(
      (response: any) => {
        if (response.IsSuccess) {
          console.log('Answer submitted successfully:', response);
          this.submitted = true;

          // Reset the form and get the next question
          this.getQuestion(this.courseId!, this.unitId!);
        } else {
          console.error('Failed to submit answer:', response.Errors);
        }
      },
      (error) => {
        console.error('Error submitting answer:', error);
      }
    );
  }

  // Method to reset the form for a new question
  resetForm(): void {
    this.selectedChoice = null;  // Reset selected choice
    this.submitted = false;  // Reset submitted flag
    //this.selectedChoiceText = null;  // Reset choice text
  }
}
