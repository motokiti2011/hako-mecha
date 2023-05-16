import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  HttpClientModule,
  HttpClientJsonpModule,
} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RoutingGuard } from './page/auth/routing.guard';
import { ReactiveFormsModule } from '@angular/forms';

import { ServiceListComponent } from './page/menu/service-contents/service-list/service-list.component';
import { MainMenuComponent } from './page/menu/main-menu/main-menu.component';
import { SideMenuComponent } from './page/menu/side-menu/side-menu.component';
import { HeaderMenuComponent } from './page/menu/header-menu/header-menu.component';
import { ServiceCreateComponent } from './page/menu/service-contents/service-create/service-create.component';
import { TransactionMenuComponent } from './page/menu/transaction-menu/transaction-menu.component';
import { TransactionListComponent } from './page/menu/transaction-menu/transaction/transaction-list/transaction-list.component';
import { MyListComponent } from './page/menu/transaction-menu/mylist-tab/mylist-detail/my-list/my-list.component';
import { BrowsingHistoryComponent } from './page/menu/transaction-menu/browsing-history-tab/browsing-history-detail/browsing-history/browsing-history.component';
// import { TansactionCompleteComponent } from './page/menu/transaction-menu/transaction-complete-tab/transaction-complete-detail/tansaction-complete/tansaction-complete.component';
import { TansactionCompleteComponent } from './page/menu/transaction-menu/transaction-complete-tab/tansaction-complete.component';
import { TransactionMenuService } from './page/menu/transaction-menu/transaction-menu.service';
import { ServiceSerchConditionsComponent } from './page/menu/service-contents/service-serch-conditions/service-serch-conditions.component';
import { LoginComponent } from './page/modal/login/login.component';
import { ReissuePasswdComponent } from './page//auth/reissue-passwd/reissue-passwd.component';
import { SignUpComponent } from './page/auth/sign-up/sign-up.component';
import { ServiceDetailComponent } from './page/menu/service-contents/service-detail/service-detail.component';
import { TrimPipe } from './pipe/trim-pipe/trim-pipe';
import { NextModalComponent } from './page/modal/next-modal/next-modal/next-modal.component';
import { ServiceListSideMenuComponent } from './page/menu/service-contents/service-list/service-list-side-menu/service-list-side-menu/service-list-side-menu.component';
import { MessageDialogComponent } from './page/modal/message-dialog/message-dialog.component';
import { ServiceTransactionComponent } from './page/menu/service-contents/service-transaction/service-transaction.component';
import { QuestionBoardComponent } from './page/modal/question-board/question-board/question-board.component';
import { TransactionMessageComponent } from './page/menu/service-contents/service-transaction/transaction-message/transaction-message/transaction-message.component';
import { OpenLevelComponent } from './page/modal/open-level/open-level/open-level.component';
import { MessagePrmReqComponent } from './page/modal/message-prm-req/message-prm-req/message-prm-req.component';
import { FavoriteComponent } from './page/menu/transaction-menu/favorite-tab/favorite/favorite.component';
import { UserRegisterComponent } from './page/auth/user-register/user-register.component';

import { POST_PROVIDER } from './page/service/interceptors/http-interceptors';
import { MyMenuComponent } from './page/menu/my-menu/my-menu.component';
import { EditUserInfoComponent } from './page/menu/my-menu/edit-user-info/edit-user-info.component';
import { SerchServiceModalComponent } from './page/modal/serch-service-modal/serch-service-modal.component';
import { ServiceCreateModalComponent } from './page/modal/service-create-modal/service-create-modal.component';
import { MechanicRegisterComponent } from './page/auth/mechanic-register/mechanic-register.component';
import { FactoryMechanicMenuComponent } from './page/menu/my-menu/factory-mechanic-menu/factory-mechanic-menu.component';
import { FactoryMenuComponent } from './page/menu/my-menu/factory-menu/factory-menu.component';
import { FactoryRegisterComponent } from './page/auth/factory-register/factory-register.component';
import { VehicleRegisterComponent } from './page/auth/vehicle-register/vehicle-register.component';
import { TransactionApprovalModalComponent } from './page/modal/transaction-approval-modal/transaction-approval-modal/transaction-approval-modal.component';
import { FactoryMechanicFavoriteMenuComponent } from './page/menu/my-menu/factory-mechanic-favorite-menu/factory-mechanic-favorite-menu.component';
import { FactoryMechanicContentsManagementComponent } from './page/menu/my-menu/factory-mechanic-contents-management/factory-mechanic-contents-management.component';
import { FactoryMechanicImpletionComponent } from './page/menu/my-menu/factory-mechanic-impletion/factory-mechanic-impletion.component';
import { ServiceEvaluationComponent } from './page/menu/service-contents/service-evaluation/service-evaluation.component';
import { ServiceRelistedComponent } from './page/menu/service-contents/service-relisted/service-relisted.component';
import { MechanicMenuComponent } from './page/menu/my-menu/mechanic-menu/mechanic-menu.component';
import { VehicleMenuComponent } from './page/menu/my-menu/vehicle-menu/vehicle-menu.component';
import { EditVehicleInfoComponent } from './page/menu/my-menu/edit-vehicle-info/edit-vehicle-info.component';
import { ImageModalComponent } from './page/modal/image-modal/image-modal.component';
import { SingleImageModalComponent } from './page/modal/single-image-modal/single-image-modal.component';
import { AdvertisementSidMenuComponent } from './page/menu/advertisement-sid-menu/advertisement-sid-menu.component';
import { FooterMenuComponent } from './page/menu/footer-menu/footer-menu.component';
import { VehicleModalComponent } from './page/modal/vehicle-modal/vehicle-modal.component';
import { ServiceAdmininfoRelistedComponent } from './page/menu/service-admininfo-relisted/service-admininfo-relisted.component';
import { PastTransactionsComponent } from './page/menu/past-transactions/past-transactions.component';
import { UseTermsComponent } from './page/menu/footer-menu/use-terms/use-terms.component';
import { PersonalInformationHandlingComponent } from './page/menu/footer-menu/personal-information-handling/personal-information-handling.component';
import { InquiryComponent } from './page/menu/footer-menu/inquiry/inquiry.component';
import { SiteMapComponent } from './page/menu/footer-menu/site-map/site-map.component';
import { HelpComponent } from './page/menu/footer-menu/help/help.component';
import { ConnectionFactoryModalComponent } from './page/modal/connection-factory-modal/connection-factory-modal.component';
import { ConnectionMechanicModalComponent } from './page/modal/connection-mechanic-modal/connection-mechanic-modal.component';
import { FactoryAdminSettingModalComponent } from './page/modal/factory-admin-setting-modal/factory-admin-setting-modal.component';
import { ServiceEditComponent } from './page/menu/service-contents/service-edit/service-edit.component';
import { MessageSelectDaialogComponent } from './page/modal/message-select-daialog/message-select-daialog.component';
import { ChangePasswdComponent } from './page/auth/change-passwd/change-passwd.component';

const ROUTE_TABLE: Routes = [
  { path: '', redirectTo: '/main_menu', pathMatch: 'full' },
  { path: 'main_menu', component: MainMenuComponent },
  { path: 'service_list', component: ServiceListComponent },
  { path: 'service_create', component: ServiceCreateComponent, canActivate: [RoutingGuard] },
  { path: 'transaction_menu', component: TransactionMenuComponent, canActivate: [RoutingGuard] },
  { path: 'serchconditions', component: ServiceSerchConditionsComponent },
  { path: 'reissue_passwd_component', component: ReissuePasswdComponent, canActivate: [RoutingGuard] },
  { path: 'signup', component: SignUpComponent },
  { path: 'servicedetail', component: ServiceDetailComponent },
  { path: 'service-transaction', component: ServiceTransactionComponent, canActivate: [RoutingGuard] },
  { path: 'user-resister-component', component: UserRegisterComponent },
  { path: 'my-menu-component', component: MyMenuComponent },
  { path: 'edit-user-menu', component: EditUserInfoComponent, canActivate: [RoutingGuard] },
  { path: 'mechanic-register', component: MechanicRegisterComponent, canActivate: [RoutingGuard] },
  { path: 'factory-mechanic-menu', component: FactoryMechanicMenuComponent, canActivate: [RoutingGuard] },
  { path: 'factory-register', component: FactoryRegisterComponent, canActivate: [RoutingGuard] },
  { path: 'vehicle-register', component: VehicleRegisterComponent, canActivate: [RoutingGuard] },
  { path: 'fcmc-favorite-menu', component: FactoryMechanicFavoriteMenuComponent, canActivate: [RoutingGuard] },
  { path: 'fcmc-manegement', component: FactoryMechanicContentsManagementComponent, canActivate: [RoutingGuard] },
  { path: 'fcmc-implaetion', component: FactoryMechanicImpletionComponent, canActivate: [RoutingGuard] },
  { path: 'service-evaluation', component: ServiceEvaluationComponent, canActivate: [RoutingGuard] },
  { path: 'service-relisted', component: ServiceRelistedComponent, canActivate: [RoutingGuard] },
  { path: 'vehicle-menu', component: VehicleMenuComponent, canActivate: [RoutingGuard] },
  { path: 'edit-vehicle', component: EditVehicleInfoComponent, canActivate: [RoutingGuard] },
  { path: 'service-admin-reference', component: ServiceAdmininfoRelistedComponent,  canActivate: [RoutingGuard]},
  { path: 'past-transactions', component: PastTransactionsComponent, canActivate: [RoutingGuard]},
  { path: 'service-edit', component: ServiceEditComponent, canActivate: [RoutingGuard]},
  { path: 'use-terms', component: UseTermsComponent },
  { path: 'personal-information-handling', component: PersonalInformationHandlingComponent },
  { path: 'inquiry', component: InquiryComponent },
  { path: 'sit-map', component: SiteMapComponent },
  { path: 'help', component: HelpComponent },
  { path: 'change-passwd', component: ChangePasswdComponent, canActivate: [RoutingGuard] },
]

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    ServiceListComponent,
    SideMenuComponent,
    HeaderMenuComponent,
    ServiceCreateComponent,
    TransactionMenuComponent,
    TransactionListComponent,
    MyListComponent,
    BrowsingHistoryComponent,
    TansactionCompleteComponent,
    ServiceSerchConditionsComponent,
    LoginComponent,
    ReissuePasswdComponent,
    SignUpComponent,
    ServiceDetailComponent,
    TrimPipe,
    NextModalComponent,
    ServiceListSideMenuComponent,
    MessageDialogComponent,
    ServiceTransactionComponent,
    QuestionBoardComponent,
    TransactionMessageComponent,
    OpenLevelComponent,
    MessagePrmReqComponent,
    FavoriteComponent,
    UserRegisterComponent,
    MyMenuComponent,
    EditUserInfoComponent,
    FactoryMechanicMenuComponent,
    SerchServiceModalComponent,
    ServiceCreateModalComponent,
    MechanicRegisterComponent,
    FactoryMenuComponent,
    FactoryRegisterComponent,
    VehicleRegisterComponent,
    TransactionApprovalModalComponent,
    FactoryMechanicFavoriteMenuComponent,
    FactoryMechanicContentsManagementComponent,
    FactoryMechanicImpletionComponent,
    ServiceEvaluationComponent,
    ServiceRelistedComponent,
    MechanicMenuComponent,
    VehicleMenuComponent,
    EditVehicleInfoComponent,
    ImageModalComponent,
    SingleImageModalComponent,
    AdvertisementSidMenuComponent,
    FooterMenuComponent,
    VehicleModalComponent,
    ServiceAdmininfoRelistedComponent,
    PastTransactionsComponent,
    UseTermsComponent,
    PersonalInformationHandlingComponent,
    InquiryComponent,
    SiteMapComponent,
    HelpComponent,
    ConnectionFactoryModalComponent,
    ConnectionMechanicModalComponent,
    FactoryAdminSettingModalComponent,
    ServiceEditComponent,
    MessageSelectDaialogComponent,
    ChangePasswdComponent,
  ],
  entryComponents: [
    TransactionListComponent,
    MyListComponent,
    BrowsingHistoryComponent,
    TansactionCompleteComponent,
    LoginComponent,
    SerchServiceModalComponent,
    ServiceCreateModalComponent,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserModule,
    NgbModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTE_TABLE),
  ],
  providers: [
    TransactionMenuService,
    // サービス依頼画面日付のMatarial部品日本語化
    {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},
    POST_PROVIDER,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
