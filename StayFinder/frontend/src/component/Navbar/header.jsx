import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import logo from '../../assets/logo.png';
import Login from '../_Auth/login';
import Register from '../_Auth/Register';
import DateSelector from '../_common/DateSelector';
import GuestSelector from '../_common/GuestSelector';

// Location Dropdown Component
function LocationDropdown({ location, onSelect, isTyping }) {
  const popularLocations = [
    'Mumbai', 'Delhi', 'Goa', 'Bangalore', 'Jaipur', 
    'Kerala', 'Manali', 'Udaipur', 'Shimla', 'Rishikesh'
  ];

  // Show filtered results only when user is actively typing
  const filteredLocations = (isTyping && location.length > 0) 
    ? popularLocations.filter(loc => 
        loc.toLowerCase().includes(location.toLowerCase())
      ) 
    : popularLocations;

  return (
    <div className="absolute top-12 left-0 bg-white shadow-lg border rounded-lg w-64 p-3 text-sm z-50 max-h-60 overflow-y-auto">
      <div className="text-xs text-gray-500 mb-2 font-medium">
        {(isTyping && location.length > 0) ? 'Search Results' : 'Popular Destinations'}
      </div>
      {filteredLocations.length > 0 ? (
        filteredLocations.map((loc, index) => (
          <div
            key={index}
            onClick={() => onSelect(loc)}
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
          >
            <MapPin className="h-3 w-3 text-gray-400" />
            <span className="text-gray-700">{loc}</span>
          </div>
        ))
      ) : (
        <div className="text-gray-500 text-center py-4">
          Koi location nahi mili
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const [formType, setFormType] = useState('');
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState({ adults: 1, children: 0, rooms: 1 });
  const [isTyping, setIsTyping] = useState(false);

  // Control which section is active: 'location' | 'calendar' | 'guests' | null
  const [activeInput, setActiveInput] = useState(null);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setActiveInput(null);
    setIsTyping(false); // Reset typing state after selection
  };

  const handleLocationInputChange = (e) => {
    setLocation(e.target.value);
    setIsTyping(true); // User is actively typing
  };

  const handleLocationClick = () => {
    setIsTyping(false); // User clicked on input, show all locations
    setActiveInput(activeInput === 'location' ? null : 'location');
  };

  const handleSearch = () => {
    if (!location.trim()) {
      alert('Please select a location first!');
      return;
    }

    const searchFilters = {
      location,
      checkIn,
      checkOut,
      ...guests,
    };

    console.log('Searching with query:', searchFilters);

    // Navigate to home page with search state
    navigate('/', {
      state: {
        selectedLocation: location,
        searchFilters: searchFilters
      }
    });
  };

  return (
    <>
      <div className="w-full flex flex-wrap items-center justify-between px-4 py-2 bg-white shadow">
        {/* Logo */}
        <div className="w-[180px] h-[50px] text-[#FF385C] flex items-center">
          <img src={logo} alt="logo" className="object-contain" />
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center shadow-md rounded-full px-4 py-2 border w-full max-w-[700px] mx-2 h-[48px] bg-white relative">
          {/* Location */}
          <div
            className="relative px-3 cursor-pointer"
            onClick={handleLocationClick}
          >
            <input
              type="text"
              placeholder="Search"
              value={location}
              onChange={handleLocationInputChange}
              className="w-[140px] text-sm font-medium placeholder-gray-600 outline-none cursor-pointer"
            />
            {activeInput === 'location' && (
              <LocationDropdown 
                location={location}
                onSelect={handleLocationSelect}
                isTyping={isTyping}
              />
            )}
          </div>

          {/* Calendar */}
          <div className="px-4 border-x">
            <DateSelector
              checkIn={checkIn}
              checkOut={checkOut}
              isOpen={activeInput === 'calendar'}
              setIsOpen={(val) => setActiveInput(val ? 'calendar' : null)}
              onChange={({ checkIn, checkOut }) => {
                setCheckIn(checkIn);
                setCheckOut(checkOut);
              }}
            />
          </div>

          {/* Guests */}
          <div>
            <GuestSelector
              guests={guests}
              setGuests={setGuests}
              isOpen={activeInput === 'guests'}
              openGuests={() => setActiveInput('guests')}
            />
          </div>

          {/* Search Button */}
          <div
            onClick={handleSearch}
            className="bg-[#FF385C] p-2 rounded-full ml-2 cursor-pointer hover:bg-[#E31E3A] transition-colors"
          >
            <Search className="text-white h-4 w-4" />
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2 mt-2 lg:mt-0">
          <button
            onClick={handleLoginClick}
            className="capitalize bg-purple-700 py-2 px-4 rounded-2xl text-white font-bold hover:bg-purple-800 text-sm transition-colors"
          >
            login
          </button>
          <button
            onClick={handleRegisterClick}
            className="capitalize bg-purple-700 py-2 px-4 rounded-2xl text-white font-bold hover:bg-purple-800 text-sm transition-colors"
          >
            register
          </button>
        </div>

        {/* Mobile Search */}
        <div className="w-full mt-3 lg:hidden">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Kahan jana hai?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 border rounded-full px-4 py-2 text-sm shadow focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSearch}
              className="bg-[#FF385C] px-4 py-2 rounded-full text-white text-sm hover:bg-[#E31E3A] transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Login/Register Form - Only renders if using inline approach */}
      {formType && (
        <div className="px-4">
          {formType === 'login' && <Login onClose={() => setFormType('')} />}
          {formType === 'register' && <Register onClose={() => setFormType('')} />}
        </div>
      )}
    </>
  );
}