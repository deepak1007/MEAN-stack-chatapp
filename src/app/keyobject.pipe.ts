import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyobject'
})
export class KeyobjectPipe implements PipeTransform {

  transform(value: any, ...args: string[]): any {
    let keysAndValue = [];
    for(let key in value){
      keysAndValue.push({key:key, value:value[key]});
    }
    return keysAndValue;
  }

}
