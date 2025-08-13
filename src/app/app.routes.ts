import {Routes} from '@angular/router';
import {PageStartComponent} from "./pages/page-start/page-start.component";
import {PageSuccessComponent} from "./pages/page-success/page-success.component";

export const routes: Routes = [
    { path: '', component: PageStartComponent },
    { path: 'success', component: PageSuccessComponent },
]
