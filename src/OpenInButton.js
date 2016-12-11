import React, { Component } from 'react'


const convert = (name, url, format) => {
  const converter = new window.ApiFlow()
  return converter.set({
    mode: 'url',
    url: url,
    name: name
  }).convert({
    target: {
      format: format
    }
  })
}

const downloadFileName = (content, filename) => {
  let pom = document.createElement('a')
  pom.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
  )
  pom.setAttribute('download', filename)

  if (document.createEvent) {
    let event = document.createEvent('MouseEvents')
    event.initEvent('click', true, true)
    pom.dispatchEvent(event)
  } else {
    pom.click()
  }
}

const getFilename = (name, format) => {
  if (format === 'swagger') {
    return `${name}.swagger.json`
  } else if (format === 'raml') {
    return `${name}.raml.yaml`
  } else if (format === 'postman') {
    return `${name}.postman.json`
  } else if (format === 'curl') {
    return `${name}.curl.md`
  }
  return name
}

export default class OpenInButtonComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      result: null
    }
  }

  render() {
    const { formatName } = this.props
    const { loading } = this.state
    let className = [ 'button', 'is-primary' ]
    if (loading) {
      className.push('is-loading')
    } else {
      className.push('is-active')
    }
    return <a className={className.join(' ')}
              onClick={::this.open}>
      <span className="icon is-small">
        <i className="fa fa-cloud-download"></i>
      </span>
      <span>{formatName}</span>
    </a>
  }

  open(e) {
    this.convertAndOpen()
    e.preventDefault()
    e.stopPropagation()
  }

  convertAndOpen() {
    const { name, url, format } = this.props
    const { loading, result } = this.state
    if (result !== null) {
      downloadFileName(result, getFilename(name, format))
      return
    }
    if (loading) {
      return
    }
    this.setState({ loading: true })
    convert(name, url, format).then(converted => {
      this.setState({
        loading: false,
        result: converted
      })
      downloadFileName(converted, getFilename(name, format))
    }, error => {
      this.setState({
        loading: false
      })
      alert(error)
    })
  }
}
