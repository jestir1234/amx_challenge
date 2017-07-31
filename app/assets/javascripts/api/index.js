document.addEventListener("DOMContentLoaded", () => {

  let urlInput = document.getElementById('url-input');
  let submitBtn = document.getElementById('submit-btn');
  let htmlNodes = [];
  let tags = {};

  submitBtn.addEventListener("click", () => {
    let url = urlInput.value;
    htmlNodes = [];
    return $.ajax({
        method: 'POST',
        url: "api/pages",
        data: {url: url},
        success: (result) => {
          updateRawHTML(result);
        }
      });
  });

  const updateRawHTML = (result) => {

    let elements = result.elements;
    elements.forEach(element => {
      let text = element[0];
      let tag = element[1];
      let node = new HTMLNode(text, tag);
      htmlNodes.push(node);
    });
    Object.keys(result.tags).forEach((tag) => {
      let relatedNodes = htmlNodes.filter((node) => {
        return node.tag === tag;
      });
      relatedNodes.forEach(node => {
        node.allRelatedNodes = relatedNodes;
      });
      tags[tag] = relatedNodes;
      addClickEvent(relatedNodes);
    });
  };

  const addClickEvent = (relatedNodes) => {
    relatedNodes.forEach((node) => {
      node.handleSelect(node.div);
    });
  };

  class HTMLNode {
    constructor(text, tag){
      this.text = text;
      this.tag = tag;
      this.allRelatedNodes = [];
      this.div = document.createElement('div');
      this.render();
    }

    giveRelatedNodes(nodes){
      this.allRelatedNodes = nodes;
    }

    handleSelect(div){
      div.addEventListener("click", () => {
        this.allRelatedNodes.forEach(node => {
          if (node.div.className === 'highlighted'){
            node.div.setAttribute('class', 'none');
          } else {
            node.div.setAttribute('class', 'highlighted');
          }
        });
      });
    }

    render(){
      let htmlContainer = document.getElementsByClassName('html-container')[0];
      this.div.innerText = this.text;
      htmlContainer.appendChild(this.div);
    }
  }

});
