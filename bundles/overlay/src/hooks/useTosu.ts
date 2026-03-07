import { useState, useEffect, useRef, useCallback } from 'react';
import type { TosuData } from '@/types/tosu';

const DEFAULT_URL = 'ws://localhost:24050/websocket/v2';
const RECONNECT_DELAY_MS = 3000;

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export interface UseTosuResult {
  data: TosuData | null;
  status: ConnectionStatus;
}

/**
 * Connects to the Tosu WebSocket and returns the live data
 *
 * @param url - Optional URL override
 */
export const useTosu = (url: string = DEFAULT_URL): UseTosuResult => {
  const [data, setData] = useState<TosuData | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  const clearReconnect = () => {
    if (reconnectTimer.current !== null) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
  };

  const connect = useCallback(() => {
    if (!isMounted.current) return;

    setStatus('connecting');

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!isMounted.current) return;
      setStatus('connected');
    };

    ws.onmessage = (event: MessageEvent<string>) => {
      if (!isMounted.current) return;
      try {
        setData(JSON.parse(event.data) as TosuData);
      } catch (err) {
        console.error('Failed to parse message:', err);
      }
    };

    ws.onclose = () => {
      if (!isMounted.current) return;
      setStatus('disconnected');
      reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY_MS);
    };

    ws.onerror = () => {
      console.warn(`WebSocket error on ${url}`);
    };
  }, [url]);

  useEffect(() => {
    isMounted.current = true;
    connect();

    return () => {
      isMounted.current = false;
      clearReconnect();
      wsRef.current?.close();
    };
  }, [connect]);

  return { data, status };
}
