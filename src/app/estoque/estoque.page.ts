import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Fruta } from '../interface/frutas.interface'; // Importa a interface Fruta

@Component({
  selector: 'app-estoque',
  templateUrl: 'estoque.page.html',
  styleUrls: ['estoque.page.scss'],
})
export class EstoquePage implements OnInit {
  frutas: Fruta[] = [];

  novaFruta: Fruta = { id: 0, nome: '', quantidade: 0, preco: 0 }; 

  constructor(
    private router: Router,
    public alert: AlertController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.carregarFrutas();
  }

  carregarFrutas() {
    let url: string = 'http://localhost:3000/frutas';
    this.http.get<Fruta[]>(url).subscribe((resposta: Fruta[]) => {
      console.log('Dados recebidos da API:', resposta);
      this.frutas = resposta;
    });
  }

  adicionarFruta() {
    let url: string = 'http://localhost:3000/estoque';
    this.http.post(url, this.novaFruta).subscribe(() => {
      this.carregarFrutas();
    }, (error) => {
      console.error('Erro ao adicionar fruta:', error);
    });
    this.novaFruta = { id: 0, nome: '', preco: 0, quantidade: 0 }; // Limpa os dados após adicionar
  }

  apagarFruta(index: number) {
    let url: string = 'http://localhost:3000/frutas/apagar/' + this.frutas[index].id;
    this.http.delete(url).subscribe(() => {
      this.carregarFrutas();
    }, (error) => {
      console.error('Erro ao apagar fruta:', error);
    });
  }

  async editarFruta(index: number) {
    let meuAlert = await this.alert.create({
      header: 'Editar Fruta',
      message: 'Insira os novos dados da fruta',
      inputs: [
        { name: 'editarNome', placeholder: 'Nome..', value: this.frutas[index].nome },
        { name: 'editarQuantidade', placeholder: 'Quantidade..', type: 'number', value: this.frutas[index].quantidade },
        { name: 'editarPreco', placeholder: 'Preço..', type: 'number', value: this.frutas[index].preco }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar', handler: data => {
            let frutaEditada: Fruta = {
              id: this.frutas[index].id,
              nome: data.editarNome,
              quantidade: data.editarQuantidade,
              preco: data.editarPreco
            };
            let url: string = 'http://localhost:3000/frutas/' + this.frutas[index].id;
            this.http.put(url, frutaEditada).subscribe(() => {
              this.carregarFrutas();
            }, (error) => {
              console.error('Erro ao editar fruta:', error);
            });
          }
        }
      ]
    });
    await meuAlert.present();
  }

  voltarParaHome() {
    this.router.navigate(['/home']);
  }
}
