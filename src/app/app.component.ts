import { Component, ElementRef, ViewChild } from '@angular/core';
import { EngineService } from 'src/services/engine.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'threejs-model-angulara-basic';

  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  public constructor(private engine: EngineService) { }

  public ngOnInit(): void {
    this.engine.createScene(this.rendererCanvas);
    this.engine.animate();
  }

}
