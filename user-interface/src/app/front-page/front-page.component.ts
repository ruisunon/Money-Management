import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'app-front-page',
    templateUrl: './front-page.component.html',
    styleUrls: ['./front-page.component.css'],
    animations: [
        trigger('showMessage1', [
            state('show', style({opacity: 1})),
            state('hide', style({opacity: 0})),
            transition('hide => show', animate(1000))
        ]),
        trigger('showMessage2', [
            state('show', style({opacity: 1})),
            state('hide', style({opacity: 0})),
            transition('hide => show', animate('1s 1s ease-in'))
        ]),
        trigger('showLearnMore', [
            state('show', style({opacity: 1, transform: 'translateY(0%)'})),
            state('hide', style({opacity: 0, transform: 'translateY(100%)'})),
            transition('hide => show', animate('1.5s 1.5s ease-in'))
        ]),
        trigger('showSingUp', [
            state('show', style({opacity: 1, transform: 'translateY(0%)'})),
            state('hide', style({opacity: 0, transform: 'translateY(100%)'})),
            transition('hide => show', animate('1.5s 2s ease-in'))
        ])
    ]
})
export class FrontPageComponent implements OnInit, AfterViewInit {
    private windowHeight: number;

    public headerState: String = "hide";

    constructor(public el: ElementRef, private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.windowHeight = window.innerHeight;
    }

    ngAfterViewInit(): void {
        this.showHeader();
        this.cdr.detectChanges();
    }

    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        this.showHeader();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.windowHeight = window.innerHeight;
        this.showHeader();
    }

    showHeader() {
        const scrollPosition = window.pageYOffset;

        if (scrollPosition < this.windowHeight * 0.5) {
            this.headerState = 'show'
        }
    }

}
