import {NgModule} from '@angular/core';
import {faUserCircle } from '@fortawesome/free-regular-svg-icons';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
    imports: [FontAwesomeModule],
    exports: [FontAwesomeModule]
})
export class IconsModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faUserCircle);
    }

}
