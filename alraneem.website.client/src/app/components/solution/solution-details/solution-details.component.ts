import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-solution-details',
  templateUrl: './solution-details.component.html',
  styleUrls: ['./solution-details.component.scss'],
})
export class SolutionDetailsComponent implements OnInit {
  @ViewChild('downloadLink', { static: false }) downloadLink?:
    | ElementRef
    | undefined;
  files = [
    { path: 'assets/pdf/', name: 'AXALARY' },
    { path: 'assets/pdf/', name: 'We Care' },
    { path: 'assets/pdf/', name: 'IVF' },
    // { path: 'assets/pdf/', name: 'CloudOffix' },
    { path: 'assets/pdf/', name: 'Real State ' },
  ];
  downloadFile(filePath: string, fileName: string, fileExtension: string) {
    const fullPath = filePath + fileName + '.' + fileExtension;
    if (this.downloadLink) {
      this.downloadLink.nativeElement.href = fullPath;
      this.downloadLink.nativeElement.download = fileName + '.' + fileExtension;
      this.downloadLink.nativeElement.click();
    } else {
    }
  }
  id: string = '';
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {

    this.route.params.subscribe((param) => {
      this.id = param['id'];
    });
    window.scrollTo(0, 0);

  }
}
