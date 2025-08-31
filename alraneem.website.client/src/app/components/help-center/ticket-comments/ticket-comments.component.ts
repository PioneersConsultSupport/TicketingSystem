import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommentService } from 'src/app/Services/comments.service';
import { TranslatePipe } from 'src/app/shared/pipes/translate.pipe';
import { Comment } from 'src/app/models/comment';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserRoles } from 'src/app/Enums/user-roles';

@Component({
  selector: 'app-ticket-comments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './ticket-comments.component.html',
  styleUrls: ['./ticket-comments.component.scss'],
})
export class TicketCommentsComponent implements OnInit {
  @Input() ticketId?: number;
  comments: Comment[] = [];
  newComment: string = '';

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments() {
    if (!this.ticketId) return;
    this.commentService
      .getCommentsByTicketId(this.ticketId)
      .subscribe((res: Comment[]) => (this.comments = res));
  }

  addComment() {
    if (!this.newComment.trim() || !this.ticketId) return;

    const newCommentObj: Comment = new Comment();
    newCommentObj.ticketId = this.ticketId;
    newCommentObj.message = this.newComment.trim();

    this.commentService
      .sendComment(newCommentObj)
      .subscribe(() => this.loadComments());

    this.newComment = '';
  }
}
