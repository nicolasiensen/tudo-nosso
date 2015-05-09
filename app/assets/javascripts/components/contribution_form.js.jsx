var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ContributionForm = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("DocumentStore")],

  getInitialState: function() {
    return {
      contributionBody: this.props.paragraph.body.replace(/<(?:.|\n)*?>/gm, ''),
      contributionJustification: "",
      isBodyValid: true,
      isJustificationValid: true,
      focusOn: null
    };
  },

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("DocumentStore").getState();
  },

  componentWillUpdate: function(nextProps, nextState) {
    if(this.state.loading && !nextState.loading) {
      this.setState({
        contributionBody: "",
        contributionJustification: ""
      });
    }

    if(!this.props.formOpen && nextProps.formOpen) {
      this.setState({
        contributionBody: this.getInitialState().contributionBody,
        focusOn: "contributionBody"
      });
    }
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

  newContributionSubmit: function(e) {
    e.preventDefault();

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
      return <a href="/users/sign_in">Registre-se ou faça login para colaborar com esse edital</a>
    }
  }
});
