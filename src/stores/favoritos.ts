import { atom, computed } from 'nanostores';

export const $favoritos = atom<number[]>([]);

export const $favoritosCount = computed(
    $favoritos,
    (favoritos) => favoritos.length
);

export function setFavoritos(ids: number[]) {
    $favoritos.set([...new Set(ids)]);
}

export function agregarFavorito(id: number) {
    const favoritos = $favoritos.get();

    if (favoritos.includes(id)) return;

    $favoritos.set([...favoritos, id]);
}

export function quitarFavorito(id: number) {
    $favoritos.set(
        $favoritos.get().filter((favoritoId) => favoritoId !== id)
    );
}

export function limpiarFavoritos() {
    $favoritos.set([]);
}