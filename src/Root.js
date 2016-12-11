import React, { Component } from 'react'

import SearchComponent from './SearchComponent'

require('./Root.styl')

const HeaderComponent = () => {
  return <section className="hero is-primary is-large">
    <div className="hero-head">
      <header className="nav">
        <div className="nav-left">
          <a className="nav-item">
            <div className="img img-brand"></div>
          </a>
        </div>
        <div className="container">
          <div className="nav-right nav-menu">
            <a className="nav-item is-active">
              APIOURS
            </a>
            <a className="nav-item"
               href="https://console.rest"
               target="_blank">
              Console.REST
            </a>
            <a className="nav-item"
               href="https://github.com/luckymarmot/API-Flow"
               target="_blank">
              API Flow
            </a>
            <a className="nav-item"
               href="https://paw.cloud"
               target="_blank">
              Paw
            </a>
            <span className="nav-item">
              <a className="button is-info is-inverted"
                 href="https://github.com/luckymarmot/apiours"
                 target="_blank">
                <span className="icon">
                  <i className="fa fa-github"></i>
                </span>
                <span>Fork on GitHub</span>
              </a>
            </span>
          </div>
        </div>
      </header>
    </div>
  </section>
}

const FooterComponent = () => {
  return <footer className="footer">
    <div className="container">
      <div className="content has-text-centered">
        <p>
          Made with <span className="icon is-small">
            <i className="fa fa-heart"></i>
          </span>{' '}
          by <a href="https://paw.cloud" target="_blank">Paw</a>.
          The source code is licensed{' '}
          <a href="http://opensource.org/licenses/mit-license.php"
             target="_blank">MIT</a>.
          Content provided under MIT License by{' '}
          <a href="https://apis.guru" target="_blank">APIs.guru</a>.
          Search provided by{' '}
          <a href="https://www.algolia.com" target="_blank">Algolia</a>.
        </p>
      </div>
    </div>
  </footer>
}

export default class Root extends Component {
  render() {
    return <div>
      <HeaderComponent />
      <section className="section">
        <div className="container">
          <h1 className="title is-1">API Search</h1>
          <SearchComponent />
        </div>
      </section>
      <FooterComponent />
    </div>
  }
}
