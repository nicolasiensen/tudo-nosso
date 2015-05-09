var ContributionForm = React.createClass({
  getInitialState: function() {
    return {
      contributionBody: this.props.paragraph.body.replace(/<(?:.|\n)*?>/gm, ''),
      contributionJustification: "",
      isBodyValid: true,
      isJustificationValid: true,
      focusOn: null
    };
  },

  componentWillUpdate: function(nextProps, nextState) {
    if(!this.props.isFormOpen && nextProps.isFormOpen) {
      this.setState({
        contributionBody: this.getInitialState().contributionBody,
        contributionJustification: "",
        focusOn: "contributionBody"
      });
    }
  },

  componentDidUpdate: function() {
    if(this.props.isFormOpen) {
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

  resizeTextarea: function(textarea) {
    e = React.findDOMNode(textarea);
    e.style.height = 0;
    e.style.height = e.scrollHeight + 2 + "px";
  },

  submitForm: function(){
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
      this.getFlux().actions.createContribution({
        body: this.state.contributionBody,
        justification: this.state.contributionJustification,
        document_id: this.props.documentId,
        paragraph_hash: this.props.paragraphHash
      }, this.props.currentUser.api_token);
    }

    this.setState({
      isBodyValid: isBodyValid,
      isJustificationValid: isJustificationValid,
      focusOn: focusOn
    });
  },

  render: function() {
    bodyClass = "block full-width field-light mb1";
    if(!this.state.isBodyValid){
      bodyClass = bodyClass + " is-error";
    }

    justificationClass = "block full-width field-light mb1";
    if(!this.state.isJustificationValid){
      justificationClass = justificationClass + " is-error";
    }

    bodyId = "contribution_body_" + this.props.paragraphHash;
    justificationId = "justification_body_" + this.props.paragraphHash;

    if(this.props.currentUser != null) {
      return <form
        className="newContributionForm clearfix"
        onSubmit={this.onSubmit}>
        <label htmlFor={bodyId}>Contribua com a sua versão para este parágrafo</label>
        <textarea
          className={bodyClass}
          name="contribution[body]"
          id={bodyId}
          ref="contributionBody"
          value={this.state.contributionBody}
          onChange={this.onContributionBodyChange}
          style={{resize: "none"}}>
        </textarea>
        <label htmlFor={justificationId}>Justifique a sua contribuição</label>
        <textarea
          className={justificationClass}
          name="contribution[justification]"
          id={justificationId}
          ref="contributionJustification"
          value={this.state.contributionJustification}
          onChange={this.onContributionJustificationChange}
          style={{resize: "none"}}>
        </textarea>
        <button className="button right" disabled={this.state.loading}>
          <i
            className="fa fa-refresh fa-spin mr1"
            style={{
              opacity: ".5",
              display: this.state.loading ? "inline" : "none"}}/>
          Enviar
        </button>
      </form>;
    } else {
      return <div className="center">
        <div className= "h1 mb1 blue muted">
          <i
            className="fa fa-lock"
            style={{fontSize: "5em"}}/>
        </div>
        <a
          className="button"
          href="/users/sign_in">
          Registre-se ou faça login para colaborar com esse edital
        </a>
      </div>
    }
  },

  // Callbacks
  onContributionBodyChange: function(e) {
    this.setState({contributionBody: e.target.value});
    this.resizeTextarea(this.refs.contributionBody);
  },

  onContributionJustificationChange: function(e) {
    this.setState({contributionJustification: e.target.value});
    this.resizeTextarea(this.refs.contributionJustification);
  },

  onSubmit: function(e) {
    e.preventDefault();
    this.submitForm();
  },

  // Fluxxor stuff
  mixins: [Fluxxor.FluxMixin(React), Fluxxor.StoreWatchMixin("DocumentStore")],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("DocumentStore").getState();
  }
});
