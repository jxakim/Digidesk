import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import CaseCard from './cards/case-card';
import '../styling/cases.css';
import { Trash, Trash2 } from 'lucide-react';
import { io } from 'socket.io-client';