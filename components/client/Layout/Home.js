import React, {Component} from "react";
import {Upload, Icon, Modal, Button} from "antd";
require('es6-promise').polyfill();
require('isomorphic-fetch');
class Home extends Component {
  constructor(props) {
    super(props);
    this.compiler = this.compiler.bind(this);
  }
  state = {
    previewVisible: false,
    previewImage: "",
    loading: false,
    fileList: [],
  };
  handleCancel = () => this.setState({previewVisible: false})
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleChange = ({fileList}) => {
    fileList = fileList.map(o => {
      if (o.status === "done" && o.response) {
        const fileName = o.response.fileName;
        return {
          uid: Date.now(),
          name: fileName,
          status: "done",
          url: `/uploads/${fileName}`,
        };
      }
      return o;
    });
    this.setState({fileList});
  }
  compiler(fileList) {
    const that = this;
    this.setState({loading: true});
    console.log("9999797897987");
    fetch('/compare', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({fileList: fileList.map(o => o.name)}),
    })
    .then(function(response) {
      console.log(response);
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(function({fileName}) {
      console.log(fileName);
      fileList = that.state.fileList;
      that.setState({
        loading: false,
        fileList: [...fileList,
          {
            uid: Date.now(),
            name: fileName,
            status: "done",
            url: `/uploads/${fileName}`,
          }],
      });
    });
  }
  render() {
    const {previewVisible, previewImage, fileList, loading} = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const UI = (
      <div>
        <Button type="primary" loading={loading} onClick={() => {
          this.compiler(fileList, this.setState);
        }}>{loading ? "对比中请勿操作" : "对比"}</Button>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          name="file"
          action="/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
        {fileList.length >= 2 ? null : uploadButton}
        </Upload>
        {fileList.length >= 2 ? UI : null}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: "100%"}} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
export default Home;
