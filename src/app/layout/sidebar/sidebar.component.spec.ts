import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { SettingsService } from '@core/services/settings.service';
import { ThemesService } from '@core/services/themes.service';
import { ScrollService } from '@core/services/scroll.service';
import { MenuService } from '@core/services/menu.service';

import { SidebarComponent } from './sidebar.component';
import { HttpClient } from '@angular/common/http';
import { ACLService } from '@core/acl/acl.service';

describe('Layout: Sidebar', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, SharedModule.forRoot()],
            declarations: [SidebarComponent],
            providers: [SettingsService, MenuService, ThemesService, ScrollService, ACLService]
        });
    });

    it('should create an instance', async(() => {
        const fixture = TestBed.createComponent(SidebarComponent);
        const comp = fixture.debugElement.componentInstance;
        expect(comp).toBeTruthy();
    }));
});
