import { SharedModule } from '@shared/shared.module';
import { TestBed, async, inject } from '@angular/core/testing';
import { SettingsService } from './settings.service';
import { TitleService } from './title.service';
import { Title } from '@angular/platform-browser';
import { MenuService } from '@core/services/menu.service';
import { ACLService } from '@core/acl/acl.service';
import { CoreModule } from '@core/core.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('Service: Title', () => {
    class TestTitleService {
        setTitle = jasmine.createSpy('reset');
    }

    let title: TestTitleService;
    const alain = 'Alain';
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                CoreModule,
                SharedModule.forRoot()
            ],
            providers: [
                { provide: Title, useClass: TestTitleService }
            ]
        });
        title = TestBed.get(Title);
    });

    it('should set the default empty title', inject([TitleService], (titleSrv: TitleService) => {
        titleSrv.suffix = alain;
        titleSrv.setTitle();
        expect(title.setTitle).toHaveBeenCalledWith(alain);
    }));

    it('should set new title', inject([TitleService], (titleSrv: TitleService) => {
        titleSrv.suffix = alain;
        titleSrv.setTitle('newTitle');
        expect(title.setTitle).toHaveBeenCalledWith('newTitle - ' + alain);
    }));
});
