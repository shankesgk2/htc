import { Component, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';

@Component({
  selector: 'app-parking-space-operate',
  templateUrl: './parking-space-operate.component.html',
  styles: []
})
export class ParkingSpaceOperateComponent implements OnInit {
  actionName = '添加';
  constructor(private subject: NzModalSubject) { }

  closeParkingSpaceOperateModel(e) {
    this.subject.destroy();
  }
  ngOnInit() {
    this.actionName = '添加';
  }

}
