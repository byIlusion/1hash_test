

const rc = React.createElement;

// Блок криптовалют
class CryptoApp extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
//      assets: this.assets(),
      assets: testResponse,
      list: [],
      from_id: 0,
      from_value: 1,
      to_id: 1,
    };
    
    if (this.state.assets) {
      this.state.list = Array({symbol: 'USD', name: 'Доллар США', price: 1})
        .concat(this.state.assets.data.map((i) => {return {symbol: i.symbol, name: i.name, price: i.priceUsd}}));
    }
    
    console.log('Constr end');
    
  }
  
  assets() {
    $.ajax({
  		async: false,
  		type: "GET",
      dataType: 'json',
  		timeout: 30000,
  		url: 'https://api.coincap.io/v2/assets',
  		success: function(data) {
        return data;
  		},
  		error: function(jqXHR, exception) {
  			console.log('Error:');
  			console.log(jqXHR);
  		},
      complete: function() {
      }
  	});
  }
  
  
  // Рейтинг валют
  rateContent() {
    return rc('div', {className: 'content-panel'},
      rc('h4', {}, 'Текущий курс'),
      rc('div', {},
        this.rateHeaderContent(),
        this.state.assets.data.map((info, i) => {return this.rateRowContent(info, i+1)})
      )
    );
  }
  
  rateRowContent(info, i) {
    const color = info.vwap24Hr > info.priceUsd ? 'text-danger' : 'text-success';
    return rc('button', {key: i, className: 'rate-item btn btn-light btn-block my-1', 'data-rank': info.rank, onClick: () => this.setState({to_id: i})},
      rc('div', {className: 'row justify-content-between'},
        rc('div', {className: 'col-1'}, info.rank),
        rc('div', {className: 'col-3 text-left font-weight-bold'}, info.name),
        rc('div', {className: 'col-2 text-info'}, info.symbol),
        rc('div', {className: 'col-3 text-right'}, parseFloat(info.priceUsd).toFixed(2) + '$'),
        rc('div', {className: 'col-2 text-right'}, parseFloat(info.changePercent24Hr).toFixed(2) + '%'),
        rc('div', {className: 'col-1 ' + color}, info.vwap24Hr > info.priceUsd ? '↓' : '↑'),
      )
    );
  }
  
  rateHeaderContent() {
    return rc('div', {className: 'container rate-item my-1'},
      rc('div', {className: 'row justify-content-between text-center font-weight-bold'},
        rc('div', {className: 'col-1'}, '#'),
        rc('div', {className: 'col-3'}, 'Name'),
        rc('div', {className: 'col-2'}, 'Logo'),
        rc('div', {className: 'col-3'}, 'Price'),
        rc('div', {className: 'col-2'}, 'Growth'),
        rc('div', {className: 'col-1'}, ''),
      )
    );
  }
  
  
  
  // Конвертор валют
  // Расчитать стоимость
  calculate() {
    return this.state.from_value * this.state.list[this.state.from_id].price / this.state.list[this.state.to_id].price;
  }
  
  cryptoReplace() {
    this.setState({
      from_id: this.state.to_id,
      from_value: this.calculate(),
      to_id: this.state.from_id
    });
  }
  
  convertorContent() {
    const current_value = this.calculate();
    return rc('div', {className: 'content-panel'},
      rc('h4', {}, 'Конвертер валют'),
      rc('div', {},
      
        rc('div', {className: 'form-row my-2'},
          rc('div', {className: 'col-md-3'},
            rc('input' , {className: 'form-control ', type: 'number', value: this.state.from_value, onChange: (e) => this.setState({from_value: parseFloat(e.target.value)})}),
          ),
          rc('div', {className: 'col-md-9'},
            rc('select', {className: 'form-control', name: 'convertFrom', value: this.state.from_id, onChange: (e) => this.setState({from_id: parseInt(e.target.value)})},
              this.state.list.map((opt, i) => {
                return rc('option', {key: 'conv_' + opt.symbol, value: i}, opt.name + ' (' + opt.symbol + ')');
              })
            )
          )
        ),
        
        rc('button', {className: 'btn btn-secondary my-2', onClick: () => this.cryptoReplace()}, 'Поменять ↑↓'),
        
        rc('div', {className: 'form-row my-2'},
          rc('div', {className: 'col-md-3'},
            rc('input' , {className: 'form-control ', type: 'number', value: current_value, readOnly: true}),
          ),
          rc('div', {className: 'col-md-9'},
            rc('select', {className: 'conv-to form-control', name: 'convertFrom', value: this.state.to_id, onChange: (e) => this.setState({to_id: parseInt(e.target.value)})},
              this.state.list.map((opt, i) => {
                return rc('option', {key: 'conv_' + opt.symbol, value: i}, opt.name + ' (' + opt.symbol + ')');
              })
            )
          )
        )
        
      )
    );
  }
  
  
  render() {
    console.log(this.state);
    if (this.state.list && this.state.list.length > 0) {
      return rc('div', {},
        rc('h2', {}, 'Курс криптовалют'),
        rc('div', {}, 'Последнее обновление: ' + this.state.assets.timestamp),
        rc('div', {className: 'row my-2'},
          rc('div', {className: 'col-sm-6'},
            this.rateContent()
          ),
          rc('div', {className: 'col-sm-6'},
            this.convertorContent()
          )
        )
      );
    } else {
      console.log('Данных нет');
      return rc('div', {}, 'Загрузка данных');
    }
    
  }
  
}


ReactDOM.render(rc(CryptoApp), document.getElementById("crypto_app"));
