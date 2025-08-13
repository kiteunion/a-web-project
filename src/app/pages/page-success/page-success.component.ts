import {Component} from '@angular/core';
import {Button} from "primeng/button";
import {Card} from "primeng/card";
import {Router} from "@angular/router";

@Component({
    selector: 'app-page-success',
    imports: [
        Button,
        Card
    ],
    templateUrl: './page-success.component.html',
    styleUrl: './page-success.component.scss'
})
export class PageSuccessComponent {
    constructor(
        private router: Router,
    ) {
    }

    goHome() {
        this.router.navigateByUrl('/');
    }
}
