import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, APP_INITIALIZER, Injector } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocalStorageService } from 'angular-web-storage';
import { JwtModule } from '@auth0/angular-jwt';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { RoutesModule } from './routes/routes.module';
import { LayoutModule } from './layout/layout.module';
import { StartupService } from './core/services/startup.service';
import { MenuService } from './core/services/menu.service';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { SettingsService } from './core/services/settings.service';
import { TokenInterceptor } from '@core/net/token/token.interceptor';
import { AuthGuard } from './core/net/token/login.guard';

export function StartupServiceFactory(startupService: StartupService): Function {
    return () => startupService.load();
}

export function tokenGetter() {
    return localStorage.getItem('token');
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule.forRoot(),
        Ng4LoadingSpinnerModule.forRoot(),
        CoreModule,
        LayoutModule,
        RoutesModule,
        JwtModule.forRoot({
            config: {
              tokenGetter: tokenGetter,
              // whitelistedDomains: ['localhost:4200', 'ds.com', 'www.ds.com'],
              headerName: 'Authorization',
              authScheme: 'Bearer ',
              throwNoTokenError: false,
              skipWhenExpired: true
            }
          })
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
        StartupService,
        {
            provide: APP_INITIALIZER,
            useFactory: StartupServiceFactory,
            deps: [StartupService],
            multi: true
        },
        AuthGuard
    ],
    exports: [
        JwtModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
