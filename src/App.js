import React from "react"
import Sidebar from "./Components/Sidebar"
import Editor from "./Components/Editor"
// import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
    
    const [notes, setNotes] = React.useState( 
        () => JSON.parse(localStorage.getItem("notes")) || []
    )
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )
    
    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])

    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: (notes.length === 1) ? "# Type your markdown note's title here" : ""
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        localStorage.removeItem("notes")
        localStorage.setItem("notes", JSON.stringify(notes))
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {
        setNotes(oldNotes => {
            let newArray = []
            for(let i=0; i<oldNotes.length; i++) {
                if(oldNotes[i].id === currentNoteId) {
                    oldNotes[i].body = text
                    newArray.unshift(oldNotes[i])
                } else 
                    newArray.push(oldNotes[i])
            }
            return newArray
        })
    }

    function deleteNote(event, currentNoteId) {
        event.stopPropagation()
        console.log(currentNoteId)
        setNotes(oldNotes => oldNotes.filter(notes => notes.id !== currentNoteId))
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[20, 80]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNotes={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
