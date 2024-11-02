import { create } from 'zustand';
import { mockLeads } from '../data/mockLeads';
import { Lead, Person } from '../types';

interface LeadStore {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  addPersonToLead: (leadId: string, person: Person, isPrimary?: boolean) => void;
  removePersonFromLead: (leadId: string, personId: string) => void;
  updatePersonInLead: (leadId: string, personId: string, updates: Partial<Person>) => void;
}

export const useLeadStore = create<LeadStore>((set) => ({
  leads: mockLeads,
  
  addLead: (leadData) => {
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...leadData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      status: 'SENT',
      resumeSent: false,
      contractSigned: false,
      interested: false,
      notInterested: false,
      response: false
    };
    
    set((state) => ({
      leads: [newLead, ...state.leads]
    }));
  },
  
  updateLead: (id, leadData) => {
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id
          ? { ...lead, ...leadData, updatedAt: new Date().toISOString() }
          : lead
      )
    }));
  },
  
  deleteLead: (id) => {
    set((state) => ({
      leads: state.leads.filter((lead) => lead.id !== id)
    }));
  },

  addPersonToLead: (leadId, person, isPrimary = false) => {
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              persons: [...lead.persons, { person, isPrimary }],
              updatedAt: new Date().toISOString()
            }
          : lead
      )
    }));
  },

  removePersonFromLead: (leadId, personId) => {
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              persons: lead.persons.filter((p) => p.person.id !== personId),
              updatedAt: new Date().toISOString()
            }
          : lead
      )
    }));
  },

  updatePersonInLead: (leadId, personId, updates) => {
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              persons: lead.persons.map((p) =>
                p.person.id === personId
                  ? { ...p, person: { ...p.person, ...updates } }
                  : p
              ),
              updatedAt: new Date().toISOString()
            }
          : lead
      )
    }));
  }
}));