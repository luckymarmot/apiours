import React, { Component } from 'react'


export default class OpenInPawButtonComponent extends Component {
  render() {
    let className = [ 'button', 'is-primary', 'is-active' ]
    return <a className={className.join(' ')}
              onClick={::this.open}>
      <span className="icon is-small">
        <i className="fa fa-arrow-right"></i>
      </span>
      <span>Paw</span>
    </a>
  }

  open() {
    const { url } = this.props
    let pawUrl = 'paw://new.document/open?'
    pawUrl += 'url=' + encodeURIComponent(url)
    pawUrl += '&importer=com.luckymarmot.PawExtensions.SwaggerImporter'
    document.location.href = pawUrl
  }
}
