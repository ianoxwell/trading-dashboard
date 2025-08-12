import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * This base component adds the common subscription clean up strategy
 * @example
 * export class Example extends ComponentBase {
 *   foo() {
 *     this.watch$.pipe(
 *       takeUntil(this.ngUnsubscribe)
 *     ).subscribe();
 *   }
 * }
 */
@Component({
  template: ''
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ComponentBase implements OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ngUnsubscribe: Subject<any> = new Subject<any>();

  ngOnDestroy(): void {
    this.destroySubscriptions();
  }

  destroySubscriptions(): void {
    this.ngUnsubscribe.next(undefined);
    this.ngUnsubscribe.complete();
  }
}
