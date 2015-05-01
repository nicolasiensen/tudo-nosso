var Paragraph = React.createClass({
  getInitialState: function() {
    return {
      contributionBody: this.props.paragraph.body.replace(/<(?:.|\n)*?>/gm, ''),
      contributionJustification: "",
      contributions: [],
      focusOn: null,
      paragraphHash: null,
      isBodyValid: true,
      isJustificationValid: true,
      isMouseOver: false,
      isWaitingFormResponse: false
    };
  },

  componentDidMount: function() {
    shaObj = new jsSHA(this.props.paragraph.body, "TEXT");
    this.setState({ paragraphHash: shaObj.getHash("SHA-256", "HEX") });
  },

  componentDidUpdate: function() {
    if(this.props.formOpen) {
      this.resizeTextarea(this.refs.contributionBody);
      this.resizeTextarea(this.refs.contributionJustification);

      if(this.state.focusOn == "contributionBody") {
        React.findDOMNode(this.refs.contributionBody).focus();
        this.setState({focusOn: null});
      } else if (this.state.focusOn == "contributionJustification") {
        React.findDOMNode(this.refs.contributionJustification).focus();
        this.setState({focusOn: null});
      }
    }
  },

  onMouseOver: function() {
    this.setState({isMouseOver: true});
  },

  onMouseOut: function() {
    this.setState({isMouseOver: false});
  },

  toggleContributionPanel: function() {
    if(!this.props.formOpen) {
      this.props.selectParagraph(this.props.paragraph.index);
      this.setState({focusOn: "contributionBody"});
    } else {
      this.props.selectParagraph(null);
    }

    return false;
  },

  newContributionSubmit: function() {
    isBodyValid = true;
    isJustificationValid = true;
    focusOn = null;

    if(this.state.contributionJustification == "") {
      isJustificationValid = false;
      focusOn = "contributionJustification";
    }

    if(this.state.contributionBody == "") {
      isBodyValid = false;
      focusOn = "contributionBody";
    }

    if(isBodyValid && isJustificationValid) {
      url = "/api/v1/contributions"

      $.ajax({
        url: url,
        headers: { 'Authorization': 'Token token="' + this.props.userApiToken + '"' },
        data: {
          contribution: {
            body: this.state.contributionBody,
            justification: this.state.contributionJustification,
            document_id: this.props.documentId,
            paragraph_hash: this.state.paragraphHash
          }
        },
        method: 'post',
        dataType: 'json',
        beforeSend: function() {
          this.setState({isWaitingFormResponse: true});
        }.bind(this),
        success: function(data) {
          contributions = this.state.contributions;
          contributions.unshift(data);
          this.setState({
            contributions: contributions,
            contributionBody: "",
            contributionJustification: ""
          });
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(url, status, err.toString());
        }.bind(this),
        complete: function() {
          this.setState({isWaitingFormResponse: false});
        }.bind(this)
      });
    }

    this.setState({
      isBodyValid: isBodyValid,
      isJustificationValid: isJustificationValid,
      focusOn: focusOn
    });

    return false;
  },

  resizeTextarea: function(textarea) {
    e = React.findDOMNode(textarea);
    e.style.height = 0;
    e.style.height = e.scrollHeight + 2 + "px";
  },

  contributionBodyChange: function(e) {
    this.setState({contributionBody: e.target.value});
    this.resizeTextarea(this.refs.contributionBody);
  },

  contributionJustificationChange: function(e) {
    this.setState({contributionJustification: e.target.value});
    this.resizeTextarea(this.refs.contributionJustification);
  },

  render: function() {
    contributionList = this.state.contributions.map(function (contribution){
      return (
        <div className="contribution">
          <div className="userName">{contribution.user.first_name} {contribution.user.last_name}</div>
          <div className="contributionBody">{contribution.body}</div>
          <div className="contributionJustification">{contribution.justification}</div>
        </div>
      );
    });

    bodyClass = "block full-width field-light mb1";
    if(!this.state.isBodyValid){
      bodyClass = bodyClass + " is-error";
    }

    justificationClass = "block full-width field-light mb1";
    if(!this.state.isJustificationValid){
      justificationClass = justificationClass + " is-error";
    }

    bodyId = "contribution_body_" + this.state.paragraphHash;
    justificationId = "justification_body_" + this.state.paragraphHash;

    if(this.props.userApiToken != null) {
      contributionForm = <form
        className="newContributionForm clearfix"
        onSubmit={this.newContributionSubmit}>
        <label htmlFor={bodyId}>Contribua com a sua versão para este parágrafo</label>
        <textarea
          className={bodyClass}
          name="contribution[body]"
          id={bodyId}
          ref="contributionBody"
          value={this.state.contributionBody}
          onChange={this.contributionBodyChange}
          style={{resize: "none"}}>
        </textarea>
        <label htmlFor={justificationId}>Justifique a sua contribuição</label>
        <textarea
          className={justificationClass}
          name="contribution[justification]"
          id={justificationId}
          ref="contributionJustification"
          value={this.state.contributionJustification}
          onChange={this.contributionJustificationChange}
          style={{resize: "none"}}>
        </textarea>
        <button className="button right" disabled={this.state.isWaitingFormResponse}>
          <i
            className="fa fa-refresh fa-spin mr1"
            style={{
              opacity: ".5",
              display: this.state.isWaitingFormResponse ? "inline" : "none"}}/>
          Enviar
        </button>
      </form>
    } else {
      contributionForm = <a href="/users/sign_in">Registre-se ou faça login para colaborar com esse edital</a>
    }

    return (
      <div
        className="paragraph clearfix"
        style={{ marginBottom: "1em" }}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}>
        <p
          className="paragraphBody"
          style={{
            opacity: ((this.props.selectedParagraphIndex != null && !this.props.formOpen) && !this.state.isMouseOver) ? .3 : 1,
            transform: this.props.formOpen ? "scale(1.05)" : "scale(1)",
            transition: ".25s",
            margin: 0
          }}
          dangerouslySetInnerHTML={{__html: this.props.paragraph.body}}>
        </p>
        <a
          className="newContributionButton mb1"
          title="Contribuições"
          href="#"
          style={{visibility: (this.state.isMouseOver || this.props.formOpen) ? 'visible' : 'hidden'}}
          onClick={this.toggleContributionPanel}>
          <i className="fa fa-comment"></i>
        </a>
        <a
          className="mb1 right gray"
          title="Fechar"
          href="#"
          style={{visibility: this.props.formOpen ? 'visible' : 'hidden'}}
          onClick={this.toggleContributionPanel}>
          <i className="fa fa-close"></i>
        </a>
        <div
          className="contributionPanel"
          style={{
            display: this.props.formOpen ? 'block' : 'none',
            padding: "1em",
            background: "#f5f5f5",
            borderRadius: "3px"
          }}>
          {contributionForm}
          <div className="contributionList">
            {contributionList}
          </div>
        </div>
      </div>
    );
  }
});
