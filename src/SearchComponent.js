import React, { Component } from 'react'
import Immutable from 'immutable'
import algoliasearch from 'algoliasearch'

import OpenInButtonComponent from './OpenInButton'
import OpenInPawButtonComponent from './OpenInPawButton'

export const ALGOLIA_ID = 'MMPT2H8ZKX'
export const ALGOLIA_KEY = 'e631f6dde8d6d06aa85ebf6c1d2286d7'

require('./SearchComponent.styl')

class SearchResultComponent extends Component {
  render() {
    const { item } = this.props
    const swaggerUrl = item.get('swaggerUrl', null)
    return <article className="media search-result-item">
      {this.renderImage()}
      <div className="media-content">
        <div className="content">
          <h3 className="title is-3">{item.get('title')}</h3>
          <p>{item.get('description')}</p>
        </div>
        <div className="level">
          <div className="level-left buttons-list">
            <OpenInButtonComponent url={swaggerUrl}
                                   name={item.get('title')}
                                   formatName="Swagger"
                                   format="swagger" />
            <OpenInButtonComponent url={swaggerUrl}
                                   name={item.get('title')}
                                   formatName="RAML"
                                   format="raml" />
            <OpenInPawButtonComponent url={swaggerUrl} />
            <OpenInButtonComponent url={swaggerUrl}
                                   name={item.get('title')}
                                   formatName="Postman"
                                   format="postman" />
            <OpenInButtonComponent url={swaggerUrl}
                                   name={item.get('title')}
                                   formatName="curl"
                                   format="curl" />
          </div>
          <div className="level-right">
            <span className="tag">{item.get('version')}</span>
            {this.renderExternalDocsLink()}
            {this.renderSupportLink()}
          </div>
        </div>
      </div>
    </article>
  }

  renderImage() {
    const { item } = this.props
    const logoUrl = item.getIn([ 'x-logo', 'url' ], null)
    if (logoUrl === null) {
      return null
    }
    return <div className="media-left">
      <figure className="image is-96x96">
        <img src={logoUrl} alt={`Logo for ${item.get('title')}`} />
      </figure>
    </div>
  }

  renderExternalDocsLink() {
    const { item } = this.props
    const externalDocsUrl = item.getIn([ 'externalDocs', 'url' ], null)
    if (externalDocsUrl === null) {
      return null
    }
    return <a className="level-item" href={externalDocsUrl} target="_blank">
      <span className="icon is-small">
        <i className="fa fa-book"></i>
      </span>
    </a>
  }

  renderSupportLink() {
    const { item } = this.props
    const contactUrl = item.getIn([ 'contact', 'url' ], null)
    if (contactUrl === null) {
      return null
    }
    return <a className="level-item" href={contactUrl} target="_blank">
      <span className="icon is-small">
        <i className="fa fa-info"></i>
      </span>
    </a>
  }
}

export default class SearchComponent extends Component {
  constructor(props) {
    super(props)
    const client = algoliasearch(ALGOLIA_ID, ALGOLIA_KEY)
    const index = client.initIndex('api-guru')
    this.state = {
      searchText: '',
      results: null,
      index: index,
      searchN: 0,
      resultN: -1
    }
  }

  render() {
    return <div>
      <p className="control has-icon has-icon-left">
        <input className="input is-large"
               type="text"
               placeholder="Search APIs…"
               value={this.state.searchText}
               onChange={::this.onChange} />
        <i className="fa fa-search"></i>
      </p>
      {this.renderSuggestions()}
      {this.renderResults()}
    </div>
  }

  renderSuggestions() {
    const { searchText } = this.state
    if (searchText !== '') {
      return null
    }
    return <p>
      Try searching for{' '}
      <a href="#" onClick={::this.onSuggestionClick}>Instagram</a>,{' '}
      <a href="#" onClick={::this.onSuggestionClick}>Google</a>,{' '}
      <a href="#" onClick={::this.onSuggestionClick}>Microsoft</a>…
    </p>
  }

  renderResults() {
    const { results, searchText } = this.state
    if (results === null || results.size === 0 || searchText === '') {
      return null
    }
    return <div className="box">
      {results.map((result, idx) => {
        return <SearchResultComponent key={idx} item={result} />
      }).toArray()}
    </div>
  }

  onChange(e) {
    const searchText = e.target.value
    this.setSearch(searchText)
  }

  onSuggestionClick(e) {
    e.preventDefault()
    e.stopPropagation()
    const searchText = e.target.innerText
    this.setSearch(searchText)
  }

  setSearch(searchText) {
    const { index } = this.state
    const searchN = this.state.searchN + 1
    if (searchText === '' || !searchText) {
      this.setState({
        searchText: '',
        searchN: searchN
      })
    } else {
      this.setState({
        searchText: searchText,
        searchN: searchN
      })
    }
    index.search(searchText, {
      hitsPerPage: 20
    }, (err, content) => {
      this.onSearchComplete(err, content, searchN)
    })
  }

  onSearchComplete(err, content, searchN) {
    const { resultN } = this.state
    /* if the id of the search is older than the latest rendered search
     * result, ignore these results (these are outdated) */
    if (resultN > searchN) {
      return
    }
    this.setState({
      results: Immutable.fromJS(content.hits),
      resultN: searchN
    })
  }
}
