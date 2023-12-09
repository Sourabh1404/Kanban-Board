import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Card from './components/card'; // Ensure correct import path and component name
import Dropdown from './components/Dropdown';
import todo from '../src/assets/survey.png';
import fail from '../src/assets/fail.png';
import plus from '../src/assets/plus-sign.png';
import menu from '../src/assets/menu.png';
import progress from '../src/assets/workflow.png'
import equalizer from '../src/assets/equalizer.png'
import down from '../src/assets/down-chevron.png'
import profile from '../src/assets/profile.svg'
import urgent from '../src/assets/urgent.png'
import lows from '../src/assets/low-signal.png'
import meds from '../src/assets/medium-signal.png'
import fulls from '../src/assets/full-signal.png'
import nopriority from '../src/assets/no-priority.png'


const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [displayDropdown, setDisplayDropdown] = useState(false);
  const [grouping, setGrouping] = useState(''); // State for grouping selection
  const [ordering, setOrdering] = useState(''); // State for ordering selection
  const getSavedViewState = () => {
    const savedGrouping = localStorage.getItem('grouping');
    const savedOrdering = localStorage.getItem('ordering');
  
    return { savedGrouping, savedOrdering };
  };
  
  // Function to save the view state to local storage
  const saveViewState = (selectedGrouping, selectedOrdering) => {
    localStorage.setItem('grouping', selectedGrouping);
    localStorage.setItem('ordering', selectedOrdering);
    // console.log('Saved grouping:', selectedGrouping);
    // console.log('Saved ordering:', selectedOrdering);
  };
  
  // Load saved view state when the component mounts
  useEffect(() => {
    const { savedGrouping, savedOrdering } = getSavedViewState();
    if (savedGrouping && savedOrdering) {
      setGrouping(savedGrouping);
      setOrdering(savedOrdering);
      handleSortingLogic(savedOrdering);
    }
    
  }, []);
  
  // Update view state and save to local storage when grouping or ordering changes
  useEffect(() => {
    saveViewState(grouping, ordering);
  }, [grouping, ordering]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.quicksell.co/v1/internal/frontend-assignment');
        const { tickets, users } = response.data;
      setTickets(tickets);
      setUsers(users);
      } catch (error) {
        console.error('Error fetching ticket data:', error);
      }
    };

    fetchData();
  }, []);
  

  const handleDisplayClick = () => {
    setDisplayDropdown(!displayDropdown);
  };

  const handleGroupingChange = (e) => {
    const selectedGrouping = e.target.value;
    setGrouping(selectedGrouping);
  };
  
  const handleOrderingChange = (e) => {
    const selectedOrdering = e.target.value;
    setOrdering(selectedOrdering);
    handleSortingLogic(selectedOrdering);
  };
   // Grouping logic based on selected option
  
  
    // Update displayed tickets based on grouping
   
    // Sorting logic based on selected option
    const handleSortingLogic = (selectedSorting) => {
      let sortedTickets = [];
    
      switch (selectedSorting) {
        case 'priority':
          sortedTickets = sortByPriority(tickets);
          break;
        case 'title':
          sortedTickets = sortByTitle(tickets);
          break;
        default:
          sortedTickets = tickets;
      }
    
      // Update displayed tickets based on sorting
      setTickets(sortedTickets);
    };

 // Function to sort tickets by priority
const sortByPriority = (tickets) => {
  return tickets.slice().sort((a, b) => b.priority - a.priority);
};
  // Function to sort tickets by title
const sortByTitle = (tickets) => {
  return tickets.slice().sort((a, b) => a.title.localeCompare(b.title));
};

  const groupingOptions = [
    { value: 'status', label: 'Status' },
    { value: 'user', label: 'User' },
    { value: 'priority', label: 'Priority' },
  ];

  const orderingOptions = [
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Title' },
  ];

  const renderTicketsByStatus = (status) => {
    return tickets
      .filter(ticket => ticket.status.toLowerCase() === status.toLowerCase())
      .map(ticket => (
        <Card key={ticket.id} ticket={ticket} />
      ));
  };
  const getUserById = (userId, users) => {
    console.log(users.find(user => user.id === userId));
    return users.find(user => user.id === userId);
  };

  const renderTicketsByUser = () => {
    // Create an object to store tickets by user ID
    const ticketsByUser = {};

    // Group tickets by user ID
    tickets.forEach(ticket => {
      if (!ticketsByUser[ticket.userId]) {
        ticketsByUser[ticket.userId] = [];
      }
      ticketsByUser[ticket.userId].push(ticket);
    });

    // Get the user IDs and sort them
    const userIds = Object.keys(ticketsByUser).sort();

    // Render cards by user in separate columns
    return (
      <div className='user-columns' style={{paddingTop:'20px'}}>
      {userIds.map(userId => {
        const userTickets = ticketsByUser[userId];
        return (
          <div key={userId} className="user-column">
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
            <div style={{ display: 'flex', alignItems: 'center', gap:'8px'}}>
            <img src={profile} width={30}></img>
            <h2 style={{fontSize:'1.2rem'}}>
              {getUserById(userId, users).name} <span style={{color:'grey', fontSize:'14px'}}>{userTickets.length}</span>
            </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap:'5px'}}>
             <img src={plus} width={30}></img>
             <img src={menu} width={30}></img>
           
           </div>
           </div>
            {userTickets.map(ticket => (
              <Card key={ticket.id} ticket={ticket} />
            ))}
          </div>

         
        );
      })}
    </div>
    );
  };
  const getPriorityLabel = (priority) => {
    const priorityInt = parseInt(priority, 10);
    switch (priorityInt) {
      case 0:
        return 'No Priority';
      case 1:
        return 'Low';
      case 2:
        return 'Medium';
      case 3:
        return 'High';
      case 4:
        return 'Urgent';
      default:
        return 'Unknown Priority';
    }
  }; 
  
  const renderTickets = () => {
    if (grouping === 'user') {
      // Display tickets grouped by user
      return renderTicketsByUser();
    } else if (grouping === 'priority') {
      // Display tickets grouped by priority
      const priorities = [0,1,2,3,4]; // Priorities in descending order

    return (
      <div className="priority-columns">
      {priorities.map(priority => {
        const filteredTickets = tickets.filter(ticket => parseInt(ticket.priority, 10) === priority);
        let iconSrc;
  switch (priority) {
    case 0:
      iconSrc = nopriority; 
      break;
    case 1:
      iconSrc = lows; 
      break;
    case 2:
      iconSrc = meds; 
      break;
    case 3:
      iconSrc = fulls; 
      break;
    case 4:
      iconSrc = urgent; 
      break;
   
    default:
      iconSrc = profile; 
      break;
  }
        return (
          <div key={priority} className="priority-column">
            <div style={{ padding:'10px', display: 'flex', justifyContent: 'space-between'}}>
            <div style={{ display: 'flex', alignItems: 'center', gap:'8px'}}>
            <img src={iconSrc} width={30} alt={`Priority ${priority} icon`} />
            <h2>
              {getPriorityLabel(priority)} <span style={{color:'grey', fontSize:'17px'}}>{filteredTickets.length}</span>
            </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap:'5px'}}>
             <img src={plus} width={30}></img>
             <img src={menu} width={30}></img>
           
           </div>
           </div>
            <div className="priority-colu">
              {filteredTickets.map(ticket => (
                <Card key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </div>
             );
      })}
    </div>
    );
          
  
      
    } else {
      // Default display by status
      const todoTickets = renderTicketsByStatus('Todo');
      const inProgressTickets = renderTicketsByStatus('In progress');
      const backlogTickets = renderTicketsByStatus('Backlog');
      return (
        <div className="grid-container">
        <div className='grid'>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '19vw' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap:'8px'}}>
    <img src={todo} width={30}></img>
    <h2>Todo <span style={{color:'grey', fontSize:'17px'}}>{todoTickets.length}</span></h2>
  </div>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap:'5px'}}>
    <img src={plus} width={30}></img>
    <img src={menu} width={30}></img>
  </div>
</div>

          <div className="grid-column">
            {todoTickets}
          </div>
        </div>
        <div className='grid'>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15vw'}}>
  <div style={{ display: 'flex', alignItems: 'center', gap:'8px'}}>
    <img src={progress} width={30}></img>
    <h2>In Progress <span style={{color:'grey', fontSize:'17px'}}>{inProgressTickets.length}</span></h2>
  </div>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap:'5px'}}>
    <img src={plus} width={30}></img>
    <img src={menu} width={30}></img>
  </div>
</div>
          <div className="grid-column">
            {inProgressTickets}
          </div>
        </div>
        <div className='grid'>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '17vw'}}>
  <div style={{ display: 'flex', alignItems: 'center', gap:'8px'}}>
    <img src={fail} width={30}></img>
    <h2>Backlog <span style={{color:'grey', fontSize:'17px'}}>{backlogTickets.length}</span></h2>
  </div>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap:'5px'}}>
    <img src={plus} width={30}></img>
    <img src={menu} width={30}></img>
  </div>
</div>
    
          <div className="grid-column">
            {backlogTickets}
          </div>
        </div>
      </div>
      );
    }
  };

  return (
    <div>
      <div className="dropdown" style={{padding:'10px'}}>
  <div className="dropdown-toggle" onClick={handleDisplayClick}><span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap:'8px'}}>
      <img src={equalizer} width={15}></img>
      <span  style={{}}> Display </span>
      <img src={down}  width={13}></img>
    </span>
    
  </div>
  {displayDropdown && (
    <div className="dropdown-content">
      <div className="submenu">
        <span style={{color:'#6a6e75'}}>Grouping:</span>
        <Dropdown options={groupingOptions} onChange={handleGroupingChange}  />
      </div>
      <div className="submenu" >
        <span style={{color:'#6a6e75'}}>Ordering:</span>
        <Dropdown  options={orderingOptions} onChange={handleOrderingChange}  />
      </div>
    </div>
  )}
</div>


    {renderTickets()}
    </div>
  );
};

export default App;
