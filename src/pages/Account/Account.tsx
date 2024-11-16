import React, { useState } from 'react';
import './Account.css';
import Navbar from '../../components/Navbar/Navbar';
import { chainConfig } from '../../constant/constant';
import { SupabaseClient } from '@supabase/supabase-js';

const Account = ({
  setPage,
  chainId,
}: {
  setPage: (page: string) => void;
  chainId: string;
}) => {
  const [address, setAddress] = useState('');

  const handleSignUpClick = async () => {
    await addAddress(address);
    setPage('home');
  };

  const supabaseClient = new SupabaseClient(
    'https://awywwzfpjnyyvbboboyi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3eXd3emZwam55eXZiYm9ib3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc5OTY2MTksImV4cCI6MjA0MzU3MjYxOX0.lXFfWhUuACvTElH7X75rPIFVpwe9ylTGxUwhaxIha9M'
  );

  async function addAddress(address: string): Promise<any> {
    const walletAddress = localStorage.getItem('walletAddress') || '';
    const { data, error } = await supabaseClient
      .from('members')
      .update({ delivery_address: address })
      .eq('wallet_address', walletAddress);

    console.log(data, walletAddress, address);
    if (error) {
      throw new Error(`Failed to update address: ${error.message}`);
    }

    return data;
  }

  const handleChange = (event: any) => {
    setAddress(event.target.value);
  };

  return (
    <div className='account-container'>
      <Navbar
        action={'setting'}
        setPage={setPage}
        blockExplorerUrl={
          chainConfig[chainId as keyof typeof chainConfig].blockExplorerUrl
        }
        chainId={chainId}
      />
      <span className='account-header-text'>Address</span>
      <textarea
        className='custom-text-area'
        value={address}
        onChange={handleChange}
        rows={4}
        cols={50}
      ></textarea>
      <button onClick={handleSignUpClick}>Submit</button>
    </div>
  );
};

export default Account;
