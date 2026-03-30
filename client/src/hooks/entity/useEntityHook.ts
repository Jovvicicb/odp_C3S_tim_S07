// TODO: Replace EntityDto and entityApi with your domain types and API service
import { useState, useEffect, useCallback } from "react";
import { entityApi } from "../../api_services/entity/EntityAPIService";
import type { EntityDto } from "../../models/entity/EntityDto";

export function useEntities(userId?: number) {
  const [items, setItems]     = useState<EntityDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = userId
        ? await entityApi.getByUserId(userId)
        : await entityApi.getAll();
      if (res.success) {
        const data = res.data;
        setItems(Array.isArray(data) ? data : (data as { items?: EntityDto[] })?.items ?? []);
      } else {
        setError(res.message);
      }
    } catch {
      setError("Failed to load items");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  return { items, loading, error, reload: load };
}
