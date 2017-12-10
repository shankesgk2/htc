import { Component, HostListener } from '@angular/core';
import * as screenfull from 'screenfull';

@Component({
    selector: 'header-fullscreen',
    template: `
    <div nz-tooltip="{{status ? '退出全屏' : '全屏'}}" class="item">
    <i class="anticon anticon-{{status ? 'shrink' : 'arrows-alt'}}"></i>
    </div>
    `
})
export class HeaderFullScreenComponent {

    status = false;

    @HostListener('click')
    _click() {
        if (screenfull.enabled) {
            screenfull.toggle();
        }
        this.status = !screenfull.isFullscreen;
    }
}
