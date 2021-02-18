const { React, getModule, getModuleByDisplayName } = require('powercord/webpack')
const { Card } = require('powercord/components')
const { Modal } = require('powercord/components/modal')
const { FormTitle, Text } = require('powercord/components')
const { close: closeModal } = require('powercord/modal')
const { match } = require('sucrase/dist/parser/tokenizer')
const { Avatar } = getModule(['Avatar'], false)
const NotesHandler = new (require('../NotesHandler'))()

class noteDisplay extends React.PureComponent {
  constructor(props) {
	super(props)
  }


  async componentDidMount() {
  }

  render() {
	const settings = NotesHandler.getNotes()
	console.log(settings)
	console.log(settings.length)
	console.log(Object.keys(settings).length)

	const noteArray = []
	const userId = []

	/* First option: A for loop just pushes a ton of stuff to an array to display later, so it's basically just displaying the note in plain text (looks awful) */
	for(let i = 0; i < Object.keys(settings).length; i++) {
		let note = settings[Object.keys(settings)[i]]
		userId.push(note['User ID'])
		noteArray.push(<Avatar src={note['Avatar URL']} size='SIZE_40' style={{
			'position': 'relative',
			'top': '20px'
		}} />)
		noteArray.push(<span style={{
		  	'color' : 'white', 
			'position' : 'relative', 
			'paddingLeft': '10px',
			'marginTop': '23px'
		}}>{note['Username']}</span>)
		noteArray.push(<Text selectable={true} style={{
			'padding-left': '50px',
			'position': 'relative'
		}}>{note['Content']}</Text>)
		try {
			let attch = note['Attachment']
			if (attch.match(".png") || attch.match(".jpg") || attch.match(".gif") || attch.match(".jpeg")) {
				noteArray.push(<img selectable={true} style={{
					'width': '70%',
					'height': 'auto',
					'padding-left': '50px',
					'padding-top': '15px',
					'padding-bottom': '15px',
					'position': 'relative',
					'display': 'inline'
				}} src={note['Attachment']} />)
			}
		} catch {
			console.log("Error in Attachment");
		}
		noteArray.push(<br/>)
	}


	return(	
	  <Modal className='Notebook' size={Modal.Sizes.LARGE}>
		
		<Modal.Header>
        <FormTitle tag='h3'>Notebook</FormTitle>
        <Modal.CloseButton onClick={closeModal}/>
    	</Modal.Header>
		
		<Modal.Content>
			{noteArray}
			<Card className='smartTypers-preview'>
      			<fakeChannel/>
    		</Card>
    	</Modal.Content>
	  </Modal>
	)
  }
}

module.exports = noteDisplay;
