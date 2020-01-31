import React, { Component } from 'react';

import { BlobServiceClient, BlobClient } from "@azure/storage-blob";


const saUrl = "<url with sas>";
const service = new BlobServiceClient(saUrl);

const url = '<url to a blob with sas>';
const blob = new BlobClient(url);

// App component - represents the whole app

export default class App extends Component {

  constructor() {
    super();
    this.state = { properties: {}, label: "Retrieving blob properties", containers: [] };
  }

  async componentDidMount() {
    try {
      let result = [];
      const iter = service.listContainers();
      let item = await iter.next();
      while (!item.done) {
        result.push(item);
        item = await iter.next();
      }
      const properties = await blob.getProperties();
      this.setState({ properties: properties, label: "Blob Properties", containers: result });
    } catch (err) {
      console.log(err);
    }
  }

  renderContainers() {
    return this.state.containers.map((container) => (
        <li>{container.value.name}</li>
    ));
  }

  renderBlobLabel() {
    return (
        <h2>{this.state.label}</h2>
    );
  }

  renderBlobProperties() {
    return (
          <ul>
          <li>{`Blob type: ${this.state.properties.blobType || "..."}`}</li>
          <li>{`Blob access tier: ${this.state.properties.accessTier || "..."}`}</li>
          </ul>
      );

  }

  render() {

    return (

        <div className="container">

        <header>

        <h1>Blob tests</h1>

      </header>

        <h1> Containers </h1>
        <ul>
        {this.renderContainers()}
        </ul>

      {this.renderBlobLabel()}
      {this.renderBlobProperties()}
      </div>

    );


  }


}
