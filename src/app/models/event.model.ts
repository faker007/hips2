/**
 * Created by hanboramjang on 2017. 4. 29..
 */
export class EventObject{
  constructor(public id: number = undefined,
              public title: string = undefined,
              public begin: string = undefined,
              public created: string = undefined,
              public updated: string = undefined,
              public address: string = undefined,
              public url: string = undefined,
              public isDeprecated: boolean = undefined,
              public tags: Array<string> = undefined) {
  };
}
