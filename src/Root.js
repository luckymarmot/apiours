import React, { Component } from 'react'

import SearchComponent from './SearchComponent'

const HeaderComponent = () => {
  return <section className="hero is-primary is-large">
      <div className="hero-head">
      <header className="nav">
        <div className="container">
          <div className="nav-right nav-menu">
            <a className="nav-item is-active">
              APIs
            </a>
            <a className="nav-item"
               href="https://console.rest"
               target="_blank">
              Console.REST
            </a>
            <a className="nav-item"
               href="https://paw.cloud"
               target="_blank">
              Paw
            </a>
            <span className="nav-item">
              <a className="button is-info is-inverted"
                 href="https://github.com/luckymarmot/API-Flow"
                 target="_blank">
                <span className="icon">
                  <i className="fa fa-github"></i>
                </span>
                <span>API Flow</span>
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
          <strong>APIs</strong> by <a href="https://paw.cloud">Paw</a>.
          The source code is licensed{' '}
          <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
          Content under MIT License by{' '}
          <a href="https://apis.guru">APIs.guru</a>.
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
