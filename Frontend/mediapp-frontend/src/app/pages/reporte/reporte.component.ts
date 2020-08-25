import { ConsultaService } from './../../service/consulta.service';
import { Component, OnInit } from '@angular/core';
import { Chart} from 'chart.js';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  chart: any;
  tipo: string;

  pdfSrc:string;

  nombreArchivo:string;
  archivosSeleccionados:FileList;

  imagenEstado:boolean = false;
  imagenData: any;

  constructor(
    private consultaService: ConsultaService,
    private sanitization: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.tipo = "line";
    this.dibujar();

    this.consultaService.leerArchivo().subscribe(data => {
      this.convertirBase64(data);
    })
  }

  cambiar(tipo: string) {
    this.tipo = tipo;
    if (this.chart != null) {
      this.chart.destroy();
    }
    this.dibujar();
  }

  dibujar() {
    this.consultaService.listarResumen().subscribe(data => {
      let cantidades = data.map(x => x.cantidad);
      let fechas = data.map(x => x.fecha);

      this.chart = new Chart('canvas', {
        type: this.tipo,
        data: {
          labels: fechas,
          datasets: 
          [
            {
              label: 'Cantidad',
              data: cantidades,
              borderColor: "#3cba9f",
              fill: false,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 0, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ]
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true,
              ticks: {
                beginAtZero: true
              }
            }],
          }
        }
      });
    })
  }

  public generarReporte() {
    this.consultaService.generarReporte().subscribe(data => {
      let reader = new FileReader();
      reader.onload = (e:any) => {  //Para leer el arreglo de bytes y expresarlo como una URL en memoria
        this.pdfSrc = e.target.result;
        console.log(this.pdfSrc);
      }
      reader.readAsArrayBuffer(data);

    })
  }

  public descargarReporte() {
    this.consultaService.generarReporte().subscribe(data =>{
      let urlRep = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = urlRep;
      a.download = "reporte.pdf";
      a.click();
    });
  }
    

  /* Para cargar una archivo tipo imagen */
  public seleccionarArchivo(e:any) {
    this.nombreArchivo = e.target.files[0].name;
    this.archivosSeleccionados = e.target.files;
  }

  public subirArchivo() {
    this.consultaService.guardarArchivo(this.archivosSeleccionados.item(0)).subscribe();
  }



  private convertirBase64(data: any) {
    let reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      let base64 = reader.result;
      this.sanitizar(base64);
    }
  }

  private sanitizar(base64: any) {
    this.imagenData = this.sanitization.bypassSecurityTrustResourceUrl(base64);
    this.imagenEstado = true;
  }

}

 
